import {useContext, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {UserContext} from '../context/UserContext';
import {FaHome, FaTasks, FaCog, FaUserCircle} from 'react-icons/fa';
import {PiNotebookFill} from 'react-icons/pi';
import {FiSearch, FiMoon, FiSun, FiBell, FiSettings} from 'react-icons/fi';
import NottieLogo from '../assets/NottieLogo.png';
import Logo from '../assets/Logo.png';
import {ThemeContext} from '../context/ThemeContext';

const DashboardLayout = ({children}) => {
  const {user, setUser} = useContext(UserContext);
  const {theme, toggleTheme} = useContext(ThemeContext);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    const confirmLogout = window.confirm('Are you sure you want to log out?');
    if (!confirmLogout) return;

    try {
      const response = await fetch('http://localhost:5000/api/logout', {
        method: 'POST',
        credentials: 'include', // Ensures session cookies are sent
        // headers: {
        //   'Content-Type': 'application/json',
        // },
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

  return (
    // <div className="flex bg-white text-black">
    <div
      className={`grid grid-cols-[auto_1fr] h-screen ${
        theme === 'dark' ? 'bg-[#181818] text-[#EAEAEA]' : 'bg-white text-black'
      }`}>
      {/* Sidebar */}
      {/* <div
        className={`h-screen bg-gray-100 bg-opacity-90 backdrop-blur-lg shadow-lg relative flex flex-col items-start ${
          sidebarOpen ? 'w-64' : 'w-16'
        } `}> */}
      <div
        className={`h-full ${
          theme === 'dark' ? 'bg-[#1F1F1F]' : 'bg-gray-100'
        } shadow-lg flex flex-col ${sidebarOpen ? 'w-64' : 'w-16'}`}>
        <button
          className="h-16 flex items-center px-4 w-full"
          onClick={() => setSidebarOpen(!sidebarOpen)}>
          {sidebarOpen ? (
            <img
              src={NottieLogo}
              alt="Nottie Full Logo"
              // className="w-40 transition-all duration-300"
              className={`w-40 transition-all duration-300 ${
                theme === 'dark' ? 'invert' : ''
              }`}
            />
          ) : (
            <img
              src={Logo}
              alt="Nottie Logo"
              // className="w-12 transition-all duration-300"
              className={`w-12 transition-all duration-300 ${
                theme === 'dark' ? 'invert' : ''
              }`}
            />
          )}
        </button>

        <nav
          className={`flex flex-col gap-2 w-full ${
            sidebarOpen ? 'pt-6' : 'pt-4'
          }`}>
          {[
            {label: 'Home', icon: <FaHome />, path: '/home'},
            {label: 'Notes', icon: <PiNotebookFill />, path: '/note'},
            {label: 'To-Do List', icon: <FaTasks />, path: '/todos'},
            {label: 'Settings', icon: <FaCog />, path: '/settings'},
          ].map(({label, icon, path}) => (
            <button
              key={label}
              onClick={() => navigate(path)}
              // className={`flex items-center p-[12px_20px] text-[18px] cursor-pointer transition-all duration-300 ease-in-out rounded-md hover:bg-gray-200 hover:bg-opacity-50 ${
              //   sidebarOpen ? 'gap-3' : 'justify-center'
              // }`}>
              className={`flex items-center p-[12px_20px] text-[18px] cursor-pointer rounded-md transition-all duration-300 ease-in-out ${
                theme === 'dark' ? 'hover:bg-[#333333]' : 'hover:bg-gray-200'
              } ${sidebarOpen ? 'gap-3' : 'justify-center'}`}>
              <span className="text-[20px]">{icon}</span>{' '}
              {/* Icon always visible */}
              {sidebarOpen && (
                <span className="whitespace-nowrap">{label}</span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="overflow-y-auto p-4">
        {/* Header */}
        {/* <div className="flex items-center justify-between p-4 shadow-md bg-white"> */}
        <div
          className={`flex items-center justify-between p-4 shadow-md ${
            theme === 'dark'
              ? 'bg-[#242424] text-[#EAEAEA]'
              : 'bg-white text-black'
          }`}>
          {/* Search Bar */}
          <div className="flex items-center gap-2 w-96">
            <FiSearch className="text-gray-500" />
            <input
              type="text"
              placeholder="Search..."
              // className="border-2 outline-none bg-transparent text-black w-full p-2"
              className={`border-2 outline-none bg-transparent w-full p-2 ${
                theme === 'dark'
                  ? 'text-[#EAEAEA] border-[#333333]'
                  : 'text-black border-gray-300'
              }`}
            />
          </div>

          {/* Icons & Profile */}
          <div className="flex items-center gap-4">
            <button onClick={toggleTheme} className="text-gray-500">
              {theme === 'light' ? <FiMoon /> : <FiSun />}
            </button>
            <FiBell className="text-gray-500" />
            <FiSettings className="text-gray-500" />

            {/* Profile Section */}
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                // className="text-gray-700 text-2xl w-10 h-10 flex items-center justify-center rounded-full bg-gray-300">
                className={`text-gray-700 text-2xl w-10 h-10 flex items-center justify-center rounded-full ${
                  theme === 'dark' ? 'bg-[#333333] text-white' : 'bg-gray-300'
                }`}>
                {user ? (
                  user.username.charAt(0).toUpperCase()
                ) : (
                  <FaUserCircle />
                )}
              </button>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                // <div className="absolute right-0 mt-2 w-48 bg-white border rounded-md shadow-lg">
                <div
                  className={`absolute right-0 mt-2 w-48 border rounded-md shadow-lg ${
                    theme === 'dark'
                      ? 'bg-[#333333] text-[#EAEAEA] border-[#444]'
                      : 'bg-white text-black border-gray-200'
                  }`}>
                  <button
                    // className="block w-full px-4 py-2 text-left hover:bg-gray-200"
                    className={`block w-full px-4 py-2 text-left transition ${
                      theme === 'dark' ? 'hover:bg-[#444]' : 'hover:bg-gray-100'
                    }`}
                    onClick={() => navigate('/profile')}>
                    Edit Profile
                  </button>
                  <button
                    // className="block w-full px-4 py-2 text-left text-red-600 hover:bg-gray-200"
                    className={`block w-full px-4 py-2 text-left transition text-red-600 ${
                      theme === 'dark'
                        ? 'hover:bg-[#444] hover:text-red-400'
                        : 'hover:bg-red-100'
                    }`}
                    onClick={handleLogout}>
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Page Content */}
        <main className="p-6 flex-1">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
