import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {getNotes, deleteNote} from '../services/apiService';
import DashboardLayout from '../components/DashboardLayout';
import {FiTrash, FiPlus, FiChevronDown} from 'react-icons/fi';
import {format} from 'date-fns';

const Note = () => {
  const [notes, setNotes] = useState([]);
  const [showDelete, setShowDelete] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

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
          const response = await fetch('http://localhost:5000/api/ocr', {
            method: 'POST',
            body: formData,
          });

          const data = await response.json();
          navigate('/notes/new', {
            state: {
              extractedTitle: data.title,
              extractedText: data.text,
            },
          });
        } catch (error) {
          console.error('Error processing OCR:', error);
        }
      }
    };

    fileInput.click();
  };

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
            {/* <button
              onClick={() => navigate('/notes/new')}
              className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
              <FiPlus className="mr-2" /> Create Note
            </button> */}
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {notes.map(note => (
            <div
              key={note.id}
              className={`p-4 bg-gray-100 dark:bg-gray-700 rounded-lg shadow-md relative transition-transform 
    transform ${
      !showDelete
        ? 'cursor-pointer hover:scale-105 hover:bg-gray-200 dark:hover:bg-gray-600'
        : ''
    }`}
              onClick={
                !showDelete ? () => navigate(`/notes/${note.id}`) : undefined
              }>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                {note.title || 'Untitled Note'}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">
                {note.created_at
                  ? format(new Date(note.created_at), 'MMM dd')
                  : 'Unknown'}
              </p>
              <p className="text-gray-700 dark:text-gray-300 text-sm mt-2">
                {note.content
                  ? note.content.length > 20
                    ? `${note.content.substring(0, 20)}...`
                    : note.content
                  : 'No content'}
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {note.tags?.map(tag => (
                  <span
                    key={tag}
                    className="px-2 py-1 text-sm bg-blue-100 text-blue-600 rounded-lg">
                    {tag}
                  </span>
                ))}
              </div>
              {showDelete && (
                <button
                  onClick={e => {
                    e.stopPropagation(); // Prevents navigation when clicking delete
                    handleDelete(note.id);
                  }}
                  className="absolute top-2 right-2 text-red-500 hover:text-red-700">
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
