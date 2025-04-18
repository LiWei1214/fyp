const bcrypt = require('bcryptjs');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const db = require('../db/db');

require('dotenv').config();

// Register API
const register = async (req, res) => {
  const {username, email, password, confirmPassword, role} = req.body;
  if (!username || !email || !password || !confirmPassword || !role) {
    return res.status(400).json({error: 'All fields are required'});
  }

  const passwordRegex = /^(?=.*[A-Z])(?=.*[\W])(?=.*\d).{8,}$/;

  if (!passwordRegex.test(password)) {
    return res.status(400).json({
      error:
        'Password must be at least 8 characters long and include at least one uppercase letter, one number, and one special character.',
    });
  }

  if (!validator.isEmail(email)) {
    return res.status(400).json({
      error: 'Invalid email address',
    });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({
      error: 'Passwords do not match',
    });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const sql =
      'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)';

    db.query(sql, [username, email, hashedPassword, role], (err, result) => {
      if (err) return res.status(500).json({error: 'Database error'});
      res.json({message: 'User registered successfully'});
    });
  } catch (error) {
    res.status(500).json({error: 'Server error'});
  }
};

// Login API
const login = async (req, res) => {
  const {email, password} = req.body;
  const query = 'SELECT * FROM users WHERE email = ?';

  db.query(query, [email], async (err, results) => {
    if (err) return res.status(500).json({error: 'Database error'});

    if (results.length === 0) {
      return res.status(401).json({error: 'User not found'});
    }

    const user = results[0];

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({error: 'Incorrect password'});
    }

    const token = jwt.sign(
      {id: user.id, role: user.role},
      process.env.JWT_SECRET,
      {expiresIn: '90d'},
    );

    let redirectUrl = '/dashboard';
    if (user.role === 'student') {
      redirectUrl = '/dashboard/student';
    } else if (user.role === 'lecturer') {
      redirectUrl = '/dashboard/lecturer';
    }

    res.json({
      message: 'Login successful',
      token,
      role: user.role,
      redirect: redirectUrl, // Send redirection URL
    });
  });
};

// const logout = async (req, res) => {
//   res.clearCookie('token'); // Remove the token stored in cookies
//   res.json({message: 'Logout successful'});
// };
const logout = async (req, res) => {
  req.logout(err => {
    if (err) {
      return res.status(500).json({message: 'Logout failed'});
    }
    req.session.destroy(err => {
      if (err) {
        return res.status(500).json({message: 'Could not destroy session'});
      }
      res.clearCookie('connect.sid'); // Clear session cookie
      res.json({message: 'Logout successful'});
    });
  });
};

module.exports = {login, register, logout};
