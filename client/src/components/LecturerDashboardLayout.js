import {useContext, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {UserContext} from '../context/UserContext';
import {ThemeContext} from '../context/ThemeContext';
import {FaHome, FaUserCircle} from 'react-icons/fa';
import {RiFolderUploadFill} from 'react-icons/ri';
import {PiNotebookFill} from 'react-icons/pi';
import {FiSearch, FiMoon, FiSun, FiSettings} from 'react-icons/fi';
import NottieLogo from '../assets/NottieLogo.png';
import Logo from '../assets/Logo.png';
import {SearchContext} from '../context/SearchContext';

const LecturerDashboardLayout = ({children}) => {
  const {user} = useContext(UserContext);
  const {theme, toggleTheme} = useContext(ThemeContext);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const {searchQuery, setSearchQuery} = useContext(SearchContext);
  const navigate = useNavigate();

  const isDark = theme === 'dark';

  const handleLogout = async () => {
    if (!window.confirm('Are you sure you want to log out?')) return;
    try {
      const response = await fetch('http://localhost:5000/api/logout', {
        method: 'POST',
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Logout failed');
      localStorage.clear();
      sessionStorage.clear();
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
      alert('Logout failed. Please try again.');
    }
  };

  return (
    <div
      className={`grid grid-cols-[auto_1fr] h-screen ${
        isDark ? 'bg-[#181818] text-[#EAEAEA]' : 'bg-[#F5F5F5] text-black'
      }`}>
      {/* Sidebar */}
      <div
        className={`h-full ${
          theme === 'dark'
            ? 'bg-gradient-to-b from-[#1F1F1F] to-[#121212]'
            : 'bg-gradient-to-b from-gray-100 to-gray-200'
        } shadow-xl flex flex-col transition-all duration-300 ease-in-out ${
          sidebarOpen ? 'w-64' : 'w-20'
        } overflow-hidden rounded-tr-3xl rounded-br-3xl`}>
        <button
          className="h-20 flex items-center justify-center"
          onClick={() => setSidebarOpen(!sidebarOpen)}>
          <img
            src={sidebarOpen ? NottieLogo : Logo}
            alt="Nottie Logo"
            className={`transition-all duration-300 ${
              theme === 'dark' ? 'invert' : ''
            } ${sidebarOpen ? 'w-40' : 'w-12'}`}
          />
        </button>

        <div className="border-t border-gray-300 opacity-20 mx-4 my-2" />

        <nav className="flex flex-col gap-2 mt-6">
          {[
            {label: 'Home', icon: <FaHome />, path: '/lecturer-dashboard'},
            {
              label: 'Upload Material',
              icon: <RiFolderUploadFill />,
              path: '/upload-material',
            },
            // {label: 'To-Do List', icon: <FaTasks />, path: '/todos'},
            // {label: 'Settings', icon: <FaCog />, path: '/settings'},
          ].map(({label, icon, path}) => (
            <button
              key={label}
              onClick={() => navigate(path)}
              className={`flex items-center ${
                sidebarOpen ? 'px-6' : 'px-2'
              } py-3 rounded-lg mx-3 gap-4 text-[18px] font-sm transition-all duration-200 hover:scale-[1.02] ${
                theme === 'dark'
                  ? 'hover:bg-[#2a2a2a]'
                  : 'hover:bg-gray-300 hover:bg-opacity-40'
              } ${
                window.location.pathname === path
                  ? theme === 'dark'
                    ? 'bg-[#333333] text-white'
                    : 'bg-white shadow-md text-black'
                  : ''
              }`}>
              <span className="text-[22px]">{icon}</span>
              {sidebarOpen && <span>{label}</span>}
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex flex-col overflow-y-auto">
        {/* Header */}
        <header
          className={`flex items-center justify-between p-4 shadow-md ${
            isDark ? 'bg-[#242424]' : 'bg-white'
          }`}>
          {/* Search */}
          <div className="flex items-center gap-2 w-96">
            <FiSearch className="text-gray-500" />
            <input
              type="text"
              placeholder="Search..."
              onChange={e => setSearchQuery(e.target.value)}
              className={`w-full p-2 border-2 rounded-md outline-none bg-transparent ${
                isDark
                  ? 'text-[#EAEAEA] border-[#333]'
                  : 'text-black border-gray-300'
              } focus:border-blue-400`}
            />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <button onClick={toggleTheme} className="text-gray-500">
              {theme === 'light' ? <FiMoon /> : <FiSun />}
            </button>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className={`w-10 h-10 flex items-center justify-center rounded-full ${
                  isDark ? 'bg-[#333] text-white' : 'bg-gray-300 text-gray-700'
                }`}>
                {user ? (
                  user.username.charAt(0).toUpperCase()
                ) : (
                  <FaUserCircle />
                )}
              </button>

              {dropdownOpen && (
                <div
                  className={`absolute right-0 mt-2 w-48 rounded-md shadow-lg border ${
                    isDark
                      ? 'bg-[#333] text-[#EAEAEA] border-[#444]'
                      : 'bg-white text-black border-gray-200'
                  }`}>
                  <button
                    className={`block w-full px-4 py-2 text-left transition ${
                      isDark ? 'hover:bg-[#444]' : 'hover:bg-gray-100'
                    }`}
                    onClick={() => {
                      setDropdownOpen(false);
                      navigate('/profile');
                    }}>
                    Edit Profile
                  </button>
                  <button
                    className={`block w-full px-4 py-2 text-left text-red-600 transition ${
                      isDark
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
        </header>

        {/* Page Content */}
        <main className="p-6 flex-1">{children}</main>
      </div>
    </div>
  );
};

export default LecturerDashboardLayout;
