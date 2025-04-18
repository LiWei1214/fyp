// import {useState, useEffect, useRef} from 'react';
// import {useParams, useNavigate} from 'react-router-dom';
// import {createNote, updateNote, getNotes} from '../services/apiService';
// import {FiArrowLeft, FiSave} from 'react-icons/fi';

// const NoteEditorPage = () => {
//   const {id} = useParams();
//   const navigate = useNavigate();
//   const [note, setNote] = useState({title: '', content: ''});
//   const [isSaving, setIsSaving] = useState(false);
//   const timeoutRef = useRef(null);

//   useEffect(() => {
//     if (id !== 'new') {
//       fetchNote();
//     }
//   }, [id]);

//   const fetchNote = async () => {
//     try {
//       const allNotes = await getNotes();
//       const existingNote = allNotes.find(n => n.id === id);
//       if (existingNote) {
//         setNote(existingNote);
//       }
//     } catch (error) {
//       console.error('Error fetching note:', error);
//     }
//   };

//   const handleAutoSave = async () => {
//     clearTimeout(timeoutRef.current);
//     timeoutRef.current = setTimeout(async () => {
//       try {
//         if (!note.title.trim()) {
//           console.error('Title is required');
//           return;
//         }

//         setIsSaving(true);

//         console.log('Saving note:', note);

//         if (id === 'new') {
//           const createdNote = await createNote(note);
//           console.log('New note created:', createdNote);
//         } else {
//           await updateNote(id, note);
//         }

//         setIsSaving(false);
//       } catch (error) {
//         console.error(
//           'Error saving note:',
//           error.response?.data || error.message,
//         );
//       }
//     }, 3000);
//   };

//   return (
//     <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
//       {/* Header */}
//       <div className="flex justify-between items-center px-6 py-4 bg-white dark:bg-gray-800 shadow">
//         <button
//           onClick={() => navigate('/note')}
//           className="text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white flex items-center">
//           <FiArrowLeft className="mr-2" /> Back
//         </button>
//         <div className="flex items-center">
//           {isSaving && (
//             <span className="text-gray-500 text-sm mr-4">Saving...</span>
//           )}
//           <button
//             onClick={() => {
//               clearTimeout(timeoutRef.current);
//               handleAutoSave();
//             }}
//             className="flex items-center bg-blue-500 text-white px-5 py-2 rounded-lg hover:bg-blue-600 transition">
//             <FiSave className="mr-2" /> Save
//           </button>
//         </div>
//       </div>

//       {/* Editor Container */}
//       <div className="flex flex-col items-center w-full flex-grow p-6">
//         <div className="w-full max-w-3xl bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
//           <input
//             type="text"
//             placeholder="Title (Required)"
//             className="w-full text-3xl font-semibold p-3 border-b dark:border-gray-700 outline-none bg-transparent focus:ring-0 dark:text-white"
//             value={note.title}
//             onChange={e => setNote({...note, title: e.target.value})}
//           />
//           <textarea
//             placeholder="Start writing..."
//             className="w-full min-h-[400px] mt-4 p-3 text-lg border-none outline-none bg-transparent dark:text-gray-300"
//             value={note.content}
//             onChange={e => {
//               setNote({...note, content: e.target.value});
//               handleAutoSave();
//             }}
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default NoteEditorPage;

import {useState, useEffect, useRef} from 'react';
import {useParams, useNavigate, useLocation} from 'react-router-dom';
import {createNote, updateNote, getNotes} from '../services/apiService';
import {FiArrowLeft, FiSave} from 'react-icons/fi';

const NoteEditorPage = () => {
  const {id} = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [note, setNote] = useState({title: '', content: ''});
  const [isSaving, setIsSaving] = useState(false);
  const timeoutRef = useRef(null);

  // useEffect(() => {
  //   if (id !== 'new') {
  //     fetchNote();
  //   } else {
  //     setNote({title: '', content: ''}); // Ensure it's reset for new notes
  //   }
  // }, [id]);

  useEffect(() => {
    if (id !== 'new') {
      fetchNote();
    } else {
      // If extracted text is provided via location state, use it as the initial content
      const extractedText = location.state?.extractedText || '';
      const extractedTitle = location.state?.extractedTitle || '';
      setNote({title: extractedTitle, content: extractedText});
    }
  }, [id, location.state]);

  const fetchNote = async () => {
    try {
      const allNotes = await getNotes();
      console.log('All Notes:', allNotes);
      console.log('Searching for ID:', id);

      const existingNote = allNotes.find(n => Number(n.id) === Number(id));

      if (existingNote) {
        console.log('Note Found:', existingNote);
        setNote(existingNote);
      } else {
        console.error(`Note with ID ${id} not found in`, allNotes);
      }
    } catch (error) {
      console.error('Error fetching note:', error);
    }
  };

  //   const handleAutoSave = () => {
  //     setIsSaving(true);
  //     clearTimeout(timeoutRef.current);
  //     timeoutRef.current = setTimeout(async () => {
  //       console.log(note.content);
  //       try {
  //         if (!note.title.trim() || !note.content.trim()) {
  //           console.log(note.content);
  //           console.warn('Title and content are required.');
  //           setIsSaving(false);
  //           return;
  //         }

  //         let response;
  //         if (id === 'new') {
  //           console.log('Creating');
  //           response = await createNote({
  //             title: note.title,
  //             content: note.content,
  //           });
  //         } else {
  //           console.log(note.content);
  //           response = await updateNote(id, {
  //             title: note.title,
  //             content: note.content,
  //           });
  //         }

  //         console.log('Save successful:', response);
  //         setIsSaving(false);
  //       } catch (error) {
  //         console.error('Error saving note:', error);
  //         setIsSaving(false);
  //       }
  //     }, 3000);
  //   };

  //   const handleChange = e => {
  //     setNote(prev => ({...prev, content: e.target.value}));
  //     handleAutoSave();
  //   };

  const handleAutoSave = updatedContent => {
    setIsSaving(true);
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(async () => {
      console.log(updatedContent);
      try {
        if (!note.title.trim() || !updatedContent.trim()) {
          console.warn('Title and content are required.');
          setIsSaving(false);
          return;
        }

        let response;
        if (id === 'new') {
          console.log('Creating');
          response = await createNote({
            title: note.title,
            content: updatedContent,
          });
        } else {
          console.log('Updating');
          response = await updateNote(id, {
            title: note.title,
            content: updatedContent,
          });
        }

        console.log('Save successful:', response);
        setIsSaving(false);
      } catch (error) {
        console.error('Error saving note:', error);
        setIsSaving(false);
      }
    }, 3000);
  };

  const handleChange = e => {
    const newContent = e.target.value;
    setNote(prev => ({...prev, content: newContent}));
    handleAutoSave(newContent);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-[#1F1F1F] text-[#EAEAEA] dark:text-white">
      {/* Header */}
      <div className="flex justify-between items-center px-6 py-4 bg-white dark:bg-[#242424] text-[#EAEAEA] shadow">
        <button
          onClick={() => navigate('/note')}
          className="text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white flex items-center">
          <FiArrowLeft className="mr-2" /> Back
        </button>
        <div className="flex items-center">
          {isSaving && (
            <span className="text-gray-500 text-sm mr-4">Saving...</span>
          )}
          <button
            onClick={() => {
              clearTimeout(timeoutRef.current);
              handleAutoSave(note.content);
            }}
            className="flex items-center bg-blue-500 text-white px-5 py-2 rounded-lg hover:bg-blue-600 transition">
            <FiSave className="mr-2" /> Save
          </button>
        </div>
      </div>

      {/* Editor Container */}
      <div className="flex flex-col items-center w-full flex-grow p-6">
        <div className="w-full max-w-3xl bg-white dark:bg-[#333333] text-white shadow-md rounded-lg p-6">
          <input
            type="text"
            placeholder="Title"
            className="w-full text-3xl font-semibold p-3 text-black border-b dark:border-gray-700 outline-none bg-transparent focus:ring-0 dark:text-white"
            value={note.title}
            onChange={e => setNote({...note, title: e.target.value})}
          />
          <textarea
            placeholder="Start writing..."
            className="w-full min-h-[400px] mt-4 p-3 text-lg text-black border-none outline-none bg-transparent dark:text-gray-300"
            value={note.content}
            onChange={handleChange}
          />
        </div>
      </div>
    </div>
  );
};

export default NoteEditorPage;
