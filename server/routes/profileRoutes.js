const express = require('express');
const router = express.Router();
const db = require('../db/db');
const bcrypt = require('bcryptjs');
const {ensureAuthenticated} = require('../middleware/authMiddleware');

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

// Change user password
router.put('/profile/password', ensureAuthenticated, async (req, res) => {
  const userId = req.user.id;
  const {currentPassword, newPassword, confirmPassword} = req.body;

  // Check for missing fields
  if (!currentPassword || !newPassword || !confirmPassword) {
    return res.status(400).json({error: 'All password fields are required'});
  }

  // Check if new passwords match
  if (newPassword !== confirmPassword) {
    return res.status(400).json({error: 'New passwords do not match'});
  }

  try {
    // Get current hashed password from DB
    const [rows] = await db
      .promise()
      .query('SELECT password FROM users WHERE id = ?', [userId]);

    if (!rows.length) {
      return res.status(404).json({error: 'User not found'});
    }

    const user = rows[0];

    // Compare current password with stored hash
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({error: 'Current password is incorrect'});
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password in DB
    const [result] = await db
      .promise()
      .query('UPDATE users SET password = ? WHERE id = ?', [
        hashedPassword,
        userId,
      ]);

    if (result.affectedRows === 0) {
      return res.status(400).json({error: 'Password update failed'});
    }

    res.json({message: 'Password updated successfully'});
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({error: 'Server error'});
  }
});

module.exports = router;
