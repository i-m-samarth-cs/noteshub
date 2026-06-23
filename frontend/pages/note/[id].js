import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { notesAPI, paymentsAPI } from '../../utils/api';
import toast from 'react-hot-toast';

export default function NoteDetail() {
  const [note, setNote] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const [hasPurchased, setHasPurchased] = useState(false);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (router.isReady && id) {
      fetchNote();
      checkUser();
    }
  }, [router.isReady, id]);

  const fetchNote = async () => {
    try {
      const response = await notesAPI.getById(id);
      setNote(response.data);
    } catch (error) {
      console.error('Error fetching note:', error);
      toast.error('Note not found');
      router.push('/browse');
    } finally {
      setLoading(false);
    }
  };

  const checkUser = () => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      try {
        const user = JSON.parse(userData);
        setUser(user);
        checkPurchaseStatus(user.id);
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  };

  const checkPurchaseStatus = async (userId) => {
    try {
      const response = await paymentsAPI.getPurchases();
      const purchases = response.data;
      const hasPurchased = purchases.some(purchase => 
        purchase.noteId === parseInt(id) && purchase.status === 'completed'
      );
      setHasPurchased(hasPurchased);
    } catch (error) {
      console.error('Error checking purchase status:', error);
    }
  };

  const handlePurchase = async () => {
    if (!user) {
      toast.error('Please login to purchase this note');
      router.push('/login');
      return;
    }

    setPurchasing(true);

    try {
      // Create Razorpay order
      const orderResponse = await paymentsAPI.createOrder({
        noteId: parseInt(id),
        amount: note.price // Send amount in rupees
      });

      const { orderId, amount } = orderResponse.data;

      // Load Razorpay script
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      document.body.appendChild(script);

      script.onload = () => {
        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_51H5jK8JqR2XvY3w',
          amount: amount,
          currency: 'INR',
          name: 'NotesHub',
          description: `Purchase: ${note.title}`,
          order_id: orderId,
          modal: {
            ondismiss: function() {
              setPurchasing(false);
            }
          },
          handler: async (response) => {
            try {
              await paymentsAPI.verifyPayment({
                orderId: response.razorpay_order_id,
                paymentId: response.razorpay_payment_id,
                signature: response.razorpay_signature,
                noteId: parseInt(id)
              });
              
              toast.success('Payment successful! You can now download the note.');
              setHasPurchased(true);
            } catch (error) {
              console.error('Payment verification error:', error);
              toast.error('Payment verification failed');
            }
          },
          prefill: {
            name: user.name,
            email: user.email
          },
          theme: {
            color: '#3B82F6'
          }
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      };
    } catch (error) {
      console.error('Purchase error:', error);
      toast.error(error.response?.data?.message || 'Failed to create order');
    } finally {
      setPurchasing(false);
    }
  };

  const handleDownload = async () => {
    try {
      const response = await notesAPI.download(id);
      
      // Create blob from response data
      const blob = new Blob([response.data], { 
        type: response.headers['content-type'] || 'application/octet-stream' 
      });
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = note.fileName;
      link.style.display = 'none';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
      }, 100);
      
      // Increment download count
      try {
        await notesAPI.incrementDownload(id);
      } catch (error) {
        console.error('Failed to increment download count:', error);
      }
      
      // Refresh note data to update download count
      await fetchNote();
      
      toast.success('Download started!');
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Download failed');
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!note) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Note not found</h2>
          <a href="/browse" className="text-blue-600 hover:text-blue-700">
            ← Back to Browse
          </a>
        </div>
      </div>
    );
  }

  const canDownload = !note.isPaid || hasPurchased;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <a href="/" className="text-2xl font-bold text-gray-900">📚 NotesHub</a>
            </div>
            <div className="flex items-center space-x-4">
              <a href="/browse" className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                Browse Notes
              </a>
              <a href="/upload" className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                Upload Note
              </a>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="p-8">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-3xl font-bold text-gray-900">{note.title}</h1>
              <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                note.isPaid ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
              }`}>
                {note.isPaid ? 'Paid' : 'Free'}
              </span>
            </div>

            {note.description && (
              <p className="text-gray-600 mb-6">{note.description}</p>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Author</h3>
                  <p className="text-lg text-gray-900">{note.author.name}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">File Type</h3>
                  <p className="text-lg text-gray-900">{note.fileType.toUpperCase()}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">File Size</h3>
                  <p className="text-lg text-gray-900">{formatFileSize(note.fileSize)}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Downloads</h3>
                  <p className="text-lg text-gray-900">{note.downloads}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Uploaded</h3>
                  <p className="text-lg text-gray-900">
                    {new Date(note.createdAt).toLocaleDateString()}
                  </p>
                </div>
                {note.isPaid && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Price</h3>
                    <p className="text-2xl font-bold text-yellow-600">₹{note.price}</p>
                  </div>
                )}
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Status</h3>
                  <p className="text-lg text-gray-900">
                    {canDownload ? 'Available for download' : 'Purchase required'}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              {note.isPaid && !hasPurchased ? (
                <button
                  onClick={handlePurchase}
                  disabled={purchasing}
                  className="flex-1 bg-yellow-600 text-white px-6 py-3 rounded-md font-medium hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {purchasing ? 'Processing...' : `Buy Now - ₹${note.price}`}
                </button>
              ) : (
                <button
                  onClick={handleDownload}
                  className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Download Note
                </button>
              )}
              
              <a
                href="/browse"
                className="flex-1 bg-gray-200 text-gray-700 px-6 py-3 rounded-md font-medium hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 text-center"
              >
                Browse More Notes
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 