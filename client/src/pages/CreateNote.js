import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { createNote, updateNote } from '../services/apiService';

const CreateNote = () => {
  // const [title, setTitle] = useState('');
  // const [content, setContent] = useState('');
  // const navigate = useNavigate();

  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  // try {
  //   const response = await fetch(`${API_URL}/api/notes`, {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //       Authorization: `Bearer ${localStorage.getItem('token')}`,
  //     },
  //     body: JSON.stringify({ title, content }),
  //   });

  //   if (response.ok) {
  //     navigate('/note');
  //   } else {
  //     console.error('Error creating note:', response.statusText);
  //   }
  // } catch (error) {
  //   console.error('Error creating note:', error);
  // }
  const navigate = useNavigate();
  const location = useLocation();

  const extractedText = location.state?.extractedText || '';
  const extractedTitle = location.state?.extractedTitle || '';

  const savedNoteId = sessionStorage.getItem('currentNoteId');

  const [note, setNote] = useState({
    id: savedNoteId ? Number(savedNoteId) : null,
    title: extractedTitle,
    content: extractedText,
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  const handleSave = async () => {
    if (!note.title.trim() || !note.content.trim()) {
      alert('Title and content are required.');
      return;
    }

    setIsSaving(true);

    try {
      let response;
      if (!note.id) {
        // First save -> create
        response = await createNote({
          title: note.title,
          content: note.content,
        });
        sessionStorage.setItem('currentNoteId', response.noteId);

        // Store returned noteId
        setNote((prev) => ({ ...prev, id: response.noteId }));
      } else {
        // Already has ID -> update
        await updateNote(note.id, { title: note.title, content: note.content });
      }

      setSaveMessage('Saved ✓');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (error) {
      console.error('Error saving note:', error);
      setSaveMessage('Failed ✗');
      setTimeout(() => setSaveMessage(''), 3000);
    } finally {
      setIsSaving(false);
    }

    useEffect(() => {
      return () => {
        sessionStorage.removeItem('currentNoteId');
      };
    }, []);
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white dark:bg-gray-800 shadow-lg rounded-lg">
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
        Create a New Note
      </h1>
      <div className="space-y-4">
        <input
          type="text"
          placeholder="Title"
          value={note.title}
          onChange={(e) =>
            setNote((prev) => ({ ...prev, title: e.target.value }))
          }
          className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
        />
        <textarea
          placeholder="Write your note here..."
          value={note.content}
          onChange={(e) =>
            setNote((prev) => ({ ...prev, content: e.target.value }))
          }
          rows="6"
          className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
        />
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition"
        >
          {isSaving ? 'Saving...' : 'Save Note'}
        </button>
        {saveMessage && <p className="text-green-500 mt-2">{saveMessage}</p>}
      </div>
    </div>
  );
};

export default CreateNote;
