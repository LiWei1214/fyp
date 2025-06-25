import {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import {PiNotebookFill} from 'react-icons/pi';
import {FiSearch, FiBell, FiSettings, FiSun, FiMoon} from 'react-icons/fi';
import {FaUserCircle, FaTasks, FaHome, FaCog} from 'react-icons/fa';

import NottieLogo from '../assets/NottieLogo.png';
import Logo from '../assets/Logo.png';

const StudentDashboard = () => {
  const navigate = useNavigate(); // ✅ Place here, inside the component but before any function
  const [user, setUser] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });
        if (!response.ok) throw new Error('Failed to fetch user');
        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchUser();
  }, []);
  const ProgressBar = ({progress}) => {
    return (
      <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
        <div
          className="bg-blue-500 h-full"
          style={{width: `${progress}%`}}></div>
      </div>
    );
  };

  const [tasks, setTasks] = useState([
    {id: 1, text: 'Finish homework', completed: false},
    {id: 2, text: 'Read one chapter', completed: false},
    {id: 3, text: 'Read 2 chapters', completed: false},
  ]);

  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleLogout = async () => {
    const confirmLogout = window.confirm('Are you sure you want to log out?');
    if (!confirmLogout) return;

    try {
      const response = await fetch('http://localhost:5000/api/logout', {
        method: 'POST',
        credentials: 'include',
      });

      if (!response.ok) throw new Error('Logout failed');

      console.log('Logout successful');

      // Clear localStorage/sessionStorage (if needed)
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('role');

      // Redirect to login page
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
      alert('Logout failed. Please try again.');
    }
  };

  const [notes, setNotes] = useState([
    {id: 1, title: 'Math Notes', content: 'Derivatives and Integrals'},
    {id: 2, title: 'History Summary', content: 'French Revolution'},
  ]);

  const [goal, setGoal] = useState('Complete all tasks today');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const completedTasks = tasks.filter(task => task.completed).length;
  const progress = (completedTasks / tasks.length) * 100 || 0;

  const toggleTask = id => {
    setTasks(
      tasks.map(task =>
        task.id === id ? {...task, completed: !task.completed} : task,
      ),
    );
  };

  return (
    <div className={`flex bg-white text-black`}>
      {/* Sidebar */}
      <div
        className={`h-screen bg-gray-100 bg-opacity-90 backdrop-blur-lg shadow-lg relative flex flex-col items-start ${
          sidebarOpen ? 'w-64' : 'w-16'
        }`}>
        <button
          className="h-16 flex items-center px-4 w-full"
          onClick={() => setSidebarOpen(!sidebarOpen)}>
          {sidebarOpen ? (
            <img
              src={NottieLogo}
              alt="Nottie Full Logo"
              className="w-40 transition-all duration-300"
            />
          ) : (
            <img
              src={Logo}
              alt="Nottie Logo"
              className="w-12 transition-all duration-300"
            />
          )}
        </button>
        <nav className="flex flex-col gap-2 w-full">
          <a
            href="#"
            className="flex items-center gap-3 p-[12px_20px] text-[18px] cursor-pointer transition-colors duration-300 ease-in-out rounded-md whitespace-nowrap hover:bg-gray-200 hover:bg-opacity-50">
            <FaHome /> {sidebarOpen && 'Home'}
          </a>
          <a
            href="#"
            className="flex items-center gap-3 p-[12px_20px] text-[18px] cursor-pointer transition-colors duration-300 ease-in-out rounded-md whitespace-nowrap hover:bg-gray-200 hover:bg-opacity-50">
            <PiNotebookFill /> {sidebarOpen && 'Notes'}
          </a>
          <a
            href="/todos"
            className="flex items-center gap-3 p-[12px_20px] text-[18px] cursor-pointer transition-colors duration-300 ease-in-out rounded-md whitespace-nowrap hover:bg-gray-200 hover:bg-opacity-50">
            <FaTasks /> {sidebarOpen && 'To-Do List'}
          </a>
          <a
            href="#"
            className="flex items-center gap-3 p-[12px_20px] text-[18px] cursor-pointer transition-colors duration-300 ease-in-out rounded-md whitespace-nowrap hover:bg-gray-200 hover:bg-opacity-50">
            <FaCog /> {sidebarOpen && 'Settings'}
          </a>
        </nav>
      </div>

      <div className="p-4 flex-1">
        {/* Header Section */}
        <div className="flex items-center justify-between p-4 shadow-md bg-white">
          <div className="flex items-center gap-2 w-96">
            <FiSearch className="text-gray-500" />
            <input
              type="text"
              placeholder="Search..."
              className="border-2 outline-none bg-transparent text-black w-full p-2"
            />
          </div>
          <div className="flex items-center gap-4">
            <button onClick={toggleTheme} className="text-gray-500">
              {theme === 'light' ? <FiMoon /> : <FiSun />}
            </button>
            <FiBell className="text-gray-500" />
            <FiSettings className="text-gray-500" />
            {/* <FaUserCircle className="text-gray-700 text-2xl" /> */}
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="text-gray-700 text-2xl w-10 h-10 flex items-center justify-center rounded-full bg-gray-300">
                {user ? (
                  user.username.charAt(0).toUpperCase()
                ) : (
                  <FaUserCircle />
                )}
              </button>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border rounded-md shadow-lg">
                  <button
                    className="block w-full px-4 py-2 text-left hover:bg-gray-200"
                    onClick={() => navigate('/profile')}>
                    Edit Profile
                  </button>
                  <button
                    className="block w-full px-4 py-2 text-left text-red-600 hover:bg-gray-200"
                    onClick={handleLogout}>
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <h2 className="text-xl font-semibold mt-4">Home</h2>
        <div className="mt-4 grid grid-cols-3 gap-4">
          {/* Goal Settings */}
          <div className="p-4 bg-white shadow-md rounded-md">
            <h3 className="font-semibold">Goal Settings</h3>
            <p>{goal}</p>
            <ProgressBar progress={progress} />
            <p className="text-sm text-gray-500 mt-2">
              {progress.toFixed(2)}% completed
            </p>
          </div>
          {/* To-Do List */}
          <div className="p-4 bg-white shadow-md rounded-md">
            <h3 className="font-semibold">To-Do List</h3>
            <ul className="mt-2">
              {tasks.map(task => (
                <li key={task.id} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleTask(task.id)}
                    className="cursor-pointer"
                  />
                  <span
                    className={
                      task.completed ? 'line-through text-gray-400' : ''
                    }>
                    {task.text}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          {/* p-4 border border-gray-600 rounded-lg cursor-pointer bg-white */}
          {/* Recent Notes */}
          <div className="p-4 bg-white shadow-md rounded-lg cursor-pointer">
            <h3 className="font-semibold">Recent Notes</h3>
            <ul className="mt-2">
              {notes.map(note => (
                <li
                  key={note.id}
                  className=" transition-transform transform hover:scale-105 hover:bg-indigo-100 p-2 border-b border-gray-300">
                  <h4 className="font-medium">{note.title}</h4>
                  <p className="text-sm text-gray-600">{note.content}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
