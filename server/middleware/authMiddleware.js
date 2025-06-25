const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.ensureAuthenticated = (req, res, next) => {
  // Get the token from the request header
  const authHeader = req.header('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({error: 'Access denied. No token provided.'});
  }

  const token = authHeader.split(' ')[1]; // Extract token after "Bearer"

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach the decoded user info to the request object
    req.user = decoded;

    next(); // Proceed to the next middleware
  } catch (err) {
    res.status(403).json({error: 'Invalid or expired token'});
  }
};
