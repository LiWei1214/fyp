import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { createNote, updateNote, getNotes } from '../services/apiService';
import { FiArrowLeft, FiSave } from 'react-icons/fi';

const NoteEditorPage = () => {
  const { id: paramId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [note, setNote] = useState({ title: '', content: '' });
  const [isSaving, setIsSaving] = useState(false);
  const timeoutRef = useRef(null);
  const [saveMessage, setSaveMessage] = useState('');
  const messageTimeoutRef = useRef(null);

  useEffect(() => {
    const initializeNote = async () => {
      if (paramId && paramId !== 'new') {
        try {
          const allNotes = await getNotes();
          const existingNote = allNotes.find(
            (n) => Number(n.id) === Number(paramId)
          );
          if (existingNote) setNote(existingNote);
        } catch (error) {
          console.error('Error fetching note:', error);
        }
      } else {
        const extractedText = location.state?.extractedText || '';
        const extractedTitle = location.state?.extractedTitle || '';
        setNote({ id: null, title: extractedTitle, content: extractedText });
      }
    };
    initializeNote();
  }, [paramId, location.state]);

  // const handleAutoSave = updatedContent => {
  //   setIsSaving(true);
  //   clearTimeout(timeoutRef.current);
  //   timeoutRef.current = setTimeout(async () => {
  //     try {
  //       if (!note.title.trim() || !updatedContent.trim()) {
  //         alert('Title and content are required.');
  //         setIsSaving(false);
  //         return;
  //       }

  //       let response;
  //       if (id === 'new') {
  //         response = await createNote({
  //           title: note.title,
  //           content: updatedContent,
  //         });
  //       } else {
  //         response = await updateNote(id, {
  //           title: note.title,
  //           content: updatedContent,
  //         });
  //       }

  //       setIsSaving(false);
  //       setSaveMessage('Saved ✓');
  //       clearTimeout(messageTimeoutRef.current);
  //       messageTimeoutRef.current = setTimeout(() => setSaveMessage(''), 3000);
  //     } catch (error) {
  //       alert('Error saving note.');
  //       setIsSaving(false);
  //       setSaveMessage('Failed ✗');
  //       clearTimeout(messageTimeoutRef.current);
  //       messageTimeoutRef.current = setTimeout(() => setSaveMessage(''), 3000);
  //     }
  //   }, 2000);
  // };

  const handleAutoSave = (updatedContent) => {
    setIsSaving(true);
    clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(async () => {
      try {
        if (!note.title.trim() || !updatedContent.trim()) {
          setIsSaving(false);
          setSaveMessage('Title and content required ✗');
          clearTimeout(messageTimeoutRef.current);
          messageTimeoutRef.current = setTimeout(
            () => setSaveMessage(''),
            3000
          );
          return;
        }

        let response;
        if (!note.id) {
          // First save -> create note
          response = await createNote({
            title: note.title,
            content: updatedContent,
          });
          // Update note state with returned ID so future saves will UPDATE instead of CREATE
          setNote((prev) => ({ ...prev, id: response.noteId }));
        } else {
          // Existing note -> update
          response = await updateNote(note.id, {
            title: note.title,
            content: updatedContent,
          });
        }

        setIsSaving(false);
        setSaveMessage('Saved ✓');
        clearTimeout(messageTimeoutRef.current);
        messageTimeoutRef.current = setTimeout(() => setSaveMessage(''), 3000);
      } catch (error) {
        console.error('Error saving note:', error);
        setIsSaving(false);
        setSaveMessage('Failed ✗');
        clearTimeout(messageTimeoutRef.current);
        messageTimeoutRef.current = setTimeout(() => setSaveMessage(''), 3000);
      }
    }, 2000);
  };

  const handleChange = (e) => {
    const newContent = e.target.value;
    setNote((prev) => ({ ...prev, content: newContent }));
    handleAutoSave(newContent);
  };

  const handleTitleChange = (e) => {
    const newTitle = e.target.value;
    setNote((prev) => ({ ...prev, title: newTitle }));
  };

  const handleManualSave = () => {
    clearTimeout(timeoutRef.current);
    handleAutoSave(note.content);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-100 to-white dark:from-[#1F1F1F] dark:to-[#121212] text-[#EAEAEA] dark:text-white">
      {/* Header */}
      <div className="flex justify-between items-center px-6 py-4 bg-white dark:bg-[#242424] shadow-md sticky top-0 z-10">
        <button
          onClick={() => navigate('/note')}
          className="text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white flex items-center"
        >
          <FiArrowLeft className="mr-2" /> Back
        </button>
        <div className="flex items-center gap-3">
          {isSaving && <span className="text-sm text-gray-400">Saving...</span>}
          {saveMessage && (
            <span className="text-sm text-green-500">{saveMessage}</span>
          )}
          <button
            onClick={() => {
              clearTimeout(timeoutRef.current);
              handleAutoSave(note.content);
            }}
            className="flex items-center bg-blue-500 text-white px-5 py-2 rounded-lg hover:bg-blue-600 transition"
          >
            <FiSave className="mr-2" /> Save
          </button>
        </div>
      </div>

      {/* Editor Container */}
      <div className="flex flex-col items-center w-full flex-grow p-6">
        <div className="w-full max-w-3xl bg-white dark:bg-[#2b2b2b] text-white shadow-xl rounded-2xl p-6">
          <input
            type="text"
            placeholder="Title"
            className="w-full text-3xl font-semibold p-3 text-black dark:text-white border-b border-gray-300 dark:border-gray-600 bg-transparent focus:ring-0 outline-none"
            value={note.title}
            onChange={handleTitleChange}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                document.getElementById('noteContent').focus();
              }
            }}
          />
          <textarea
            id="noteContent"
            placeholder="Start writing..."
            className="w-full min-h-[400px] mt-4 p-3 text-lg text-gray-800 dark:text-gray-200 bg-transparent outline-none resize-none"
            value={note.content}
            onChange={handleChange}
          />
        </div>
      </div>
    </div>
  );
};

export default NoteEditorPage;
