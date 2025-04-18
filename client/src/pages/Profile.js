import React, {useContext, useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import {ThemeContext} from '../context/ThemeContext'; // Import theme context

const Profile = () => {
  const {theme} = useContext(ThemeContext); // Get the theme state
  const [user, setUser] = useState({username: '', email: ''});
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

  return (
    // <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md mt-10">
    <div
      className={`max-w-md mx-auto p-6 rounded-lg shadow-md mt-10 ${
        theme === 'dark' ? 'bg-[#242424] text-[#EAEAEA]' : 'bg-white text-black'
      }`}>
      <h2 className="text-2xl font-semibold text-center mb-4">Profile</h2>

      <div className="mb-4">
        {/* <label className="block text-gray-700">Username:</label> */}
        <label
          className={`block ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
          }`}>
          Username:
        </label>
        <input
          type="text"
          name="username"
          value={user.username}
          onChange={handleChange}
          disabled={!isEditing}
          // className="w-full px-3 py-2 border rounded-md"
          className={`w-full px-3 py-2 border rounded-md 
            ${
              theme === 'dark'
                ? 'bg-white border-gray-600 text-black disabled:bg-gray-700 disabled:text-white'
                : 'bg-gray-100 border-gray-300 text-black disabled:bg-white disabled:text-black'
            }`}
        />
      </div>

      <div className="mb-4">
        {/* <label className="block text-gray-700">Email:</label> */}
        <label
          className={`block ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
          }`}>
          Email:
        </label>
        <input
          type="email"
          name="email"
          value={user.email}
          onChange={handleChange}
          disabled={!isEditing}
          // className="w-full px-3 py-2 border rounded-md"
          className={`w-full px-3 py-2 border rounded-md 
            ${
              theme === 'dark'
                ? 'bg-white border-gray-600 text-black disabled:bg-gray-700 disabled:text-white'
                : 'bg-gray-100 border-gray-300 text-black disabled:bg-white disabled:text-black'
            }`}
        />
      </div>

      {!isEditing ? (
        <button
          onClick={() => setIsEditing(true)}
          // className="w-full bg-blue-500 text-white px-4 py-2 rounded-md">
          className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition">
          Edit Profile
        </button>
      ) : (
        <button
          onClick={handleUpdate}
          // className="w-full bg-green-500 text-white px-4 py-2 rounded-md">
          className="w-full bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md transition">
          Save Changes
        </button>
      )}

      <button
        onClick={() => navigate('/home')}
        // className="w-full mt-2 bg-gray-400 text-white px-4 py-2 rounded-md">
        className="w-full mt-2 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md transition">
        Back to Dashboard
      </button>
    </div>
  );
};

export default Profile;
