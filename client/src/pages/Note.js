import React, {useEffect, useContext, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {getNotes, deleteNote} from '../services/apiService';
import DashboardLayout from '../components/DashboardLayout';
import {FiTrash, FiPlus, FiChevronDown} from 'react-icons/fi';
import {format} from 'date-fns';
import {SearchContext} from '../context/SearchContext';

const Note = () => {
  const [notes, setNotes] = useState([]);
  const [showDelete, setShowDelete] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const [uploading, setUploading] = useState(false);
  const {searchQuery} = useContext(SearchContext);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const data = await getNotes();
      setNotes(data);
    } catch (error) {
      console.error('Error fetching notes:', error);
    }
  };

  const handleDelete = async id => {
    await deleteNote(id);
    fetchNotes();
  };

  const handleCreateNoteWithImage = async () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';

    fileInput.onchange = async event => {
      const file = event.target.files[0];
      if (file) {
        const formData = new FormData();
        formData.append('image', file);

        try {
          setUploading(true);
          const response = await fetch('http://localhost:5000/api/ocr', {
            method: 'POST',
            body: formData,
          });

          const data = await response.json();
          setUploading(false);
          if (!data.text || !data.text.trim()) {
            alert(
              'OCR is not detecting any text. Please upload a clear picture!',
            );
            return;
          }
          navigate('/notes/new', {
            state: {
              extractedTitle: data.title,
              extractedText: data.text,
            },
          });
        } catch (error) {
          setUploading(false);
          console.error('Error processing OCR:', error);
          alert('Upload failed. Please try again!');
        }
      }
    };

    fileInput.click();
  };

  const filteredNotes = notes.filter(note =>
    `${note.title} ${note.content}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase()),
  );

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Notes
          </h2>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowDelete(!showDelete)}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition">
              {showDelete ? 'Cancel' : 'Delete Notes'}
            </button>
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
                Create Note
                <FiChevronDown className="ml-2" />
              </button>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 rounded-lg shadow-lg overflow-hidden z-50">
                  <button
                    onClick={() => navigate('/notes/new')}
                    className="block px-4 py-2 text-left w-full text-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600">
                    Create Note
                  </button>
                  <button
                    onClick={handleCreateNoteWithImage}
                    className="block px-4 py-2 text-left w-full text-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600">
                    Create Note with Image
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        {uploading && (
          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 mb-4">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8z"></path>
            </svg>
            <span>Processing image...</span>
          </div>
        )}
        {filteredNotes.length === 0 && !uploading && (
          <div className="text-center text-gray-500 dark:text-gray-400 mt-10">
            <p>No notes yet.</p>
            <button
              onClick={() => navigate('/notes/new')}
              className="mt-4 inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
              <FiPlus className="mr-2" /> Create your first note
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNotes.map(note => (
            <div
              key={note.id}
              className={`group relative p-5 rounded-2xl transition-transform transform ${
                !showDelete ? 'cursor-pointer hover:scale-[1.02]' : ''
              } bg-white dark:bg-gradient-to-br dark:from-[#2a2a2a] dark:to-[#1f1f1f] shadow-xl`}
              onClick={
                !showDelete ? () => navigate(`/notes/${note.id}`) : undefined
              }>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white truncate">
                {note.title || 'Untitled Note'}
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                {note.created_at
                  ? format(new Date(note.created_at), 'MMM dd')
                  : 'Unknown'}
              </p>
              <p className="text-gray-700 dark:text-gray-300 text-sm mt-3 line-clamp-2">
                {note.content || 'No content'}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {note.tags?.map(tag => (
                  <span
                    key={tag}
                    className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-200 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
              {showDelete && (
                <button
                  onClick={e => {
                    e.stopPropagation();
                    const confirmed = window.confirm(
                      'Are you sure you want to delete this note?',
                    );
                    if (confirmed) {
                      handleDelete(note.id);
                    }
                  }}
                  className="absolute top-3 right-3 text-red-500 hover:text-red-700 transition">
                  <FiTrash size={18} />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Note;
