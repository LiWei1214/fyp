const express = require('express');
const router = express.Router();
const db = require('../db/db');
const {ensureAuthenticated} = require('../middleware/authMiddleware'); // Import middleware

// Apply authentication middleware
router.get('/profile', ensureAuthenticated, async (req, res) => {
  const userId = req.user?.id;
  // console.log('Fetching profile for user ID:', userId);

  if (!userId) return res.status(401).json({message: 'Unauthorized'});

  try {
    const [user] = await db
      .promise()
      .query('SELECT username, email FROM users WHERE id = ?', [userId]);
    // console.log('User data fetched from DB:', user);

    if (!user.length) {
      console.log('User not found');
      return res.status(404).json({message: 'User not found'});
    }

    res.json(user[0]);
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({message: 'Error fetching user data'});
  }
});

// Update user profile
router.put('/profile', ensureAuthenticated, async (req, res) => {
  // console.log('Updating profile for user:', req.user); // Debug log

  if (!req.user) {
    return res
      .status(401)
      .json({error: 'Unauthorized: User not authenticated'});
  }
  const userId = req.user.id;
  const {username, email} = req.body;

  if (!username || !email) {
    return res.status(400).json({error: 'Username and email are required'});
  }

  try {
    const [result] = await db
      .promise()
      .query('UPDATE users SET username = ?, email = ? WHERE id = ?', [
        username,
        email,
        userId,
      ]);

    // console.log('Update result:', result); // Debug log

    if (result.affectedRows === 0) {
      return res.status(404).json({error: 'User not found'});
    }

    res.json({message: 'Profile updated successfully'});
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({error: 'Database error'});
  }
});

module.exports = router;
