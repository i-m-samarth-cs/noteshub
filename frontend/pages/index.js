import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { authAPI, notesAPI } from '../utils/api';
import toast from 'react-hot-toast';

export default function Home() {
  const [user, setUser] = useState(null);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    
    // Fetch featured notes
    const fetchNotes = async () => {
      try {
        const response = await notesAPI.getAll({ limit: 6 });
        setNotes(response.data);
      } catch (error) {
        console.error('Error fetching notes:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchNotes();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    toast.success('Logged out successfully');
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">📚 NotesHub</h1>
            </div>
            <div className="flex items-center space-x-4">
              <a href="/browse" className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                Browse Notes
              </a>
              {user ? (
                <>
                  <a href="/upload" className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                    Upload Note
                  </a>
                  {user.isAdmin && (
                    <a href="/admin/dashboard" className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                      Admin Dashboard
                    </a>
                  )}
                  <button
                    onClick={handleLogout}
                    className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <a href="/login" className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                    Login
                  </a>
                  <a href="/register" className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700">
                    Sign Up
                  </a>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
              <span className="block">Share and Discover</span>
              <span className="block text-blue-600">Academic Notes</span>
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Upload your study materials, share knowledge, and access high-quality notes from students worldwide.
            </p>
            <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
              <div className="rounded-md shadow">
                <a
                  href="/browse"
                  className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10"
                >
                  Browse Notes
                </a>
              </div>
              <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
                <a
                  href="/register"
                  className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10"
                >
                  Get Started
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Notes */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Featured Notes</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {notes.map((note) => (
            <div key={note.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 truncate">{note.title}</h3>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    note.isPaid ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                  }`}>
                    {note.isPaid ? 'Paid' : 'Free'}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{note.description}</p>
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <span>📄 {note.fileType.toUpperCase()}</span>
                  <span>📦 {formatFileSize(note.fileSize)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">👤 {note.author.name}</span>
                  <a
                    href={`/note/${note.id}`}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    View Details →
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
        {notes.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No notes available yet. Be the first to upload!</p>
          </div>
        )}
      </div>
    </div>
  );
} 