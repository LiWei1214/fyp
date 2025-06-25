import {createContext, useState, useEffect} from 'react';

export const UserContext = createContext();

const UserProvider = ({children}) => {
  const [user, setUser] = useState(null);
  const token = localStorage.getItem('token');

  // Fetch user profile data on app load
  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) return;

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
        setUser(data); // Set user data globally
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchProfile();
  }, [token]); // Run when token changes

  return (
    <UserContext.Provider value={{user, setUser}}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
