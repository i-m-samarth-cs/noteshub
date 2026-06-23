import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { notesAPI } from '../utils/api';

export default function Browse() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const router = useRouter();

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const response = await notesAPI.getAll();
      setNotes(response.data);
    } catch (error) {
      console.error('Error fetching notes:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         note.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filter === 'all') return matchesSearch;
    if (filter === 'free') return matchesSearch && !note.isPaid;
    if (filter === 'paid') return matchesSearch && note.isPaid;
    
    return matchesSearch;
  });

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
              <a href="/" className="text-2xl font-bold text-gray-900">📚 NotesHub</a>
            </div>
            <div className="flex items-center space-x-4">
              <a href="/" className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                Home
              </a>
              <a href="/upload" className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                Upload Note
              </a>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Browse Notes</h1>
          
          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search notes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Notes</option>
                <option value="free">Free Only</option>
                <option value="paid">Paid Only</option>
              </select>
            </div>
          </div>
        </div>

        {/* Notes Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredNotes.map((note) => (
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
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {note.description || 'No description available'}
                </p>
                
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <span>📄 {note.fileType.toUpperCase()}</span>
                  <span>📦 {formatFileSize(note.fileSize)}</span>
                </div>
                
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <span>👤 {note.author.name}</span>
                  <span>📥 {note.downloads} downloads</span>
                </div>
                
                {note.isPaid && (
                  <div className="mb-4">
                    <span className="text-lg font-bold text-yellow-600">₹{note.price}</span>
                  </div>
                )}
                
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-400">
                    {new Date(note.createdAt).toLocaleDateString()}
                  </span>
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

        {filteredNotes.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">
              {searchTerm || filter !== 'all' 
                ? 'No notes match your search criteria.' 
                : 'No notes available yet. Be the first to upload!'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
} 