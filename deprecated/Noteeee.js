import {useState} from 'react';
import {FiSearch, FiBell, FiSettings, FiPlus} from 'react-icons/fi';
import {FaUserCircle} from 'react-icons/fa';

const Sidebar = () => {
  return (
    <div className="w-64 bg-white p-4 shadow-md h-screen flex flex-col">
      <h1 className="text-lg font-bold mb-4">Nottie</h1>
      <nav className="flex flex-col gap-2">
        <a href="/" className="p-2 rounded-md hover:bg-gray-200">
          Home
        </a>
        <a href="#" className="p-2 rounded-md hover:bg-gray-200">
          Notes
        </a>
        <a href="#" className="p-2 rounded-md hover:bg-gray-200">
          To-Do List
        </a>
        <a href="#" className="p-2 rounded-md hover:bg-gray-200">
          Settings
        </a>
      </nav>
    </div>
  );
};

const Header = () => {
  return (
    <div className="flex items-center justify-between p-4 shadow-md bg-white">
      <div className="flex items-center gap-2">
        <FiSearch className="text-gray-500" />
        <input
          type="text"
          placeholder="Search..."
          className="border-none outline-none"
        />
      </div>
      <div className="flex items-center gap-4">
        <FiBell className="text-gray-500" />
        <FiSettings className="text-gray-500" />
        <FaUserCircle className="text-gray-700 text-2xl" />
      </div>
    </div>
  );
};

const NotesSection = () => {
  const [notes, setNotes] = useState([
    {title: 'Meeting Notes', date: 'Aug 25', tags: ['Work', 'Important']},
    {title: 'Shopping List', date: 'Aug 24', tags: ['Personal']},
  ]);

  return (
    <div className="p-4 flex-1">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Notes</h2>
        <button className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-md">
          <FiPlus /> Create Note
        </button>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-4">
        {notes.map((note, index) => (
          <div key={index} className="p-4 bg-gray-100 rounded-md shadow-sm">
            <h3 className="font-semibold">{note.title}</h3>
            <p className="text-sm text-gray-500">{note.date}</p>
            <div className="mt-2 flex gap-2">
              {note.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-2 py-1 bg-blue-200 text-blue-700 rounded-md text-xs">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function App() {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Header />
        <NotesSection />
      </div>
    </div>
  );
}
