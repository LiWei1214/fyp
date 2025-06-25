import React, {useContext, useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import {ThemeContext} from '../context/ThemeContext'; // Import theme context

const Profile = () => {
  const {theme} = useContext(ThemeContext); // Get the theme state
  const [user, setUser] = useState({username: '', email: ''});
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem('token'); // Retrieve token from storage

  // Fetch user profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/profile', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          credentials: 'include', // Ensure cookies and session data are sent
        });

        if (!response.ok) throw new Error('Failed to fetch profile');

        const data = await response.json();
        setUser(data); // Set user data in state
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchProfile();
  }, []);

  // Handle form input changes
  const handleChange = e => {
    setUser({...user, [e.target.name]: e.target.value});
  };

  const handlePasswordChange = e => {
    setPasswordData({...passwordData, [e.target.name]: e.target.value});
  };

  const togglePasswordVisibility = field => {
    setShowPassword(prev => ({...prev, [field]: !prev[field]}));
  };

  // Handle profile update
  const handleUpdate = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/profile', {
        method: 'PUT',
        credentials: 'include',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      });

      if (!response.ok) throw new Error('Failed to update profile');

      alert('Profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Update failed. Try again.');
    }
  };

  const handlePasswordUpdate = async () => {
    const {currentPassword, newPassword, confirmPassword} = passwordData;

    if (!currentPassword || !newPassword || !confirmPassword) {
      alert('Please fill in all password fields');
      return;
    }

    if (newPassword !== confirmPassword) {
      alert('New passwords do not match');
      return;
    }

    try {
      const response = await fetch(
        'http://localhost:5000/api/profile/password',
        {
          method: 'PUT',
          credentials: 'include',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(passwordData),
        },
      );

      if (!response.ok) throw new Error('Password update failed');

      alert('Password changed successfully!');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error) {
      console.error('Error updating password:', error);
      alert('Error changing password. Please try again.');
    }
  };

  return (
    // <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md mt-10">
    <div
      className={`max-w-2xl mx-auto p-6 mt-10 rounded-2xl shadow-lg ${
        theme === 'dark' ? 'bg-[#242424] text-[#EAEAEA]' : 'bg-white text-black'
      }`}>
      <h2 className="text-3xl font-bold text-center mb-6">User Profile</h2>

      {/* Profile Details */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4 border-b pb-2">
          Profile Information
        </h3>

        <div className="mb-4">
          <label
            className={`block mb-1 font-medium ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
            Username
          </label>
          <input
            type="text"
            name="username"
            value={user.username}
            onChange={handleChange}
            disabled={!isEditing}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none ${
              theme === 'dark'
                ? 'bg-white text-black border-gray-600 disabled:bg-gray-700 disabled:text-white'
                : 'bg-gray-100 text-black border-gray-300 disabled:bg-white disabled:text-black'
            }`}
          />
        </div>

        <div className="mb-4">
          <label
            className={`block mb-1 font-medium ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
            Email
          </label>
          <input
            type="email"
            name="email"
            value={user.email}
            onChange={handleChange}
            disabled={!isEditing}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none ${
              theme === 'dark'
                ? 'bg-white text-black border-gray-600 disabled:bg-gray-700 disabled:text-white'
                : 'bg-gray-100 text-black border-gray-300 disabled:bg-white disabled:text-black'
            }`}
          />
        </div>

        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition">
            Edit Profile
          </button>
        ) : (
          <button
            onClick={handleUpdate}
            className="w-full bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition">
            Save Changes
          </button>
        )}
      </div>

      {/* Password Section */}
      <div className="border-t pt-6">
        <div className="mb-4">
          <label
            className={`block mb-1 font-medium ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
            Current Password
          </label>
          <div className="relative">
            <input
              type={showPassword.current ? 'text' : 'password'}
              name="currentPassword"
              placeholder="Current Password"
              value={passwordData.currentPassword}
              onChange={handlePasswordChange}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none ${
                theme === 'dark'
                  ? 'bg-gray-700 text-white border-gray-600 placeholder-gray-400'
                  : 'bg-gray-100 text-black border-gray-300 placeholder-gray-500'
              }`}
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility('current')}
              className="absolute inset-y-0 right-3 flex items-center text-sm text-gray-500 hover:text-gray-700">
              {showPassword.current ? '🙈' : '👁️'}
            </button>
          </div>
        </div>

        <div className="mb-4">
          <label
            className={`block mb-1 font-medium ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
            New Password
          </label>
          <div className="relative">
            <input
              type={showPassword.new ? 'text' : 'password'}
              name="newPassword"
              placeholder="New Password"
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none ${
                theme === 'dark'
                  ? 'bg-gray-700 text-white border-gray-600 placeholder-gray-400'
                  : 'bg-gray-100 text-black border-gray-300 placeholder-gray-500'
              }`}
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility('new')}
              className="absolute inset-y-0 right-3 flex items-center text-sm text-gray-500 hover:text-gray-700">
              {showPassword.new ? '🙈' : '👁️'}
            </button>
          </div>
        </div>

        <div className="mb-4">
          <label
            className={`block mb-1 font-medium ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
            Confirm New Password
          </label>
          <div className="relative">
            <input
              type={showPassword.confirm ? 'text' : 'password'}
              name="confirmPassword"
              placeholder="Confirm New Password"
              value={passwordData.confirmPassword}
              onChange={handlePasswordChange}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none ${
                theme === 'dark'
                  ? 'bg-gray-700 text-white border-gray-600 placeholder-gray-400'
                  : 'bg-gray-100 text-black border-gray-300 placeholder-gray-500'
              }`}
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility('confirm')}
              className="absolute inset-y-0 right-3 flex items-center text-sm text-gray-500 hover:text-gray-700">
              {showPassword.confirm ? '🙈' : '👁️'}
            </button>
          </div>
        </div>

        <button
          onClick={handlePasswordUpdate}
          className="w-full bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg transition">
          Update Password
        </button>
      </div>

      <button
        onClick={() => navigate('/home')}
        className="w-full mt-6 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition">
        Back to Dashboard
      </button>
    </div>
  );
};

export default Profile;
