const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs'); // ✅ Import bcrypt
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const userRoutes = require('./routes/userRoutes');
const db = require('../server/db/db');
const profileRoutes = require('./routes/profileRoutes'); // ✅ Import profile routes
const {ensureAuthenticated} = require('./middleware/authMiddleware');
const multer = require('multer');
const Tesseract = require('tesseract.js');
const fs = require('fs').promises;

const app = express();

app.use(
  session({
    secret: process.env.SESSION_KEY,
    resave: false,
    saveUninitialized: false,
  }),
);

// app.use(cors());
app.use(
  cors({
    origin: 'http://localhost:3000', // Explicitly allow frontend URL
    credentials: true, // Allow cookies/sessions
    // methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow required HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allow necessary headers
  }),
);

app.get('/api/user', ensureAuthenticated, async (req, res) => {
  try {
    const userId = req.user.userId; // Assuming session-based auth
    if (!userId) return res.status(401).json({message: 'Unauthorized'});

    const [user] = await db
      .promise()
      .query('SELECT username FROM users WHERE id = ?', [userId]);

    if (user.length === 0)
      return res.status(404).json({message: 'User not found'});

    res.json(user[0]); // Returns { username: 'JohnDoe' }
  } catch (error) {
    console.error(error);
    res.status(500).json({message: 'Server error'});
  }
});

app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new LocalStrategy({usernameField: 'email'}, (email, password, done) => {
    const sql = 'SELECT * FROM users WHERE email = ? '; // Query to fetch user
    db.query(sql, [email], (err, results) => {
      if (err) {
        return done(err);
      }
      if (results.length === 0) {
        return done(null, false, {message: 'User not found'});
      }

      const user = results[0]; // Get the first matching user

      // Compare password
      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) throw err;
        if (isMatch) {
          return done(null, user); // Authentication successful
        } else {
          return done(null, false, {message: 'Incorrect password'});
        }
      });
    });
  }),
);

passport.serializeUser((user, done) => {
  done(null, user.id); // Store user ID in session
});

passport.deserializeUser((id, done) => {
  const sql = 'SELECT * FROM users WHERE id = ?';
  db.query(sql, [id], (err, results) => {
    if (err) return done(err);
    done(null, results[0]); // Return user data
  });
});

app.use('/api', profileRoutes);

app.use('/api', userRoutes);

const upload = multer({dest: 'uploads/'});
// app.post('/api/ocr', upload.single('image'), async (req, res) => {
//   if (!req.file) {
//     return res.status(400).json({error: 'No image uploaded'});
//   }

//   try {
//     const {
//       data: {text},
//     } = await Tesseract.recognize(req.file.path, 'eng');
//     fs.unlinkSync(req.file.path); // Delete uploaded image after processing
//     res.json({text});
//   } catch (error) {
//     res.status(500).json({error: 'OCR processing failed'});
//   }
// });
app.post('/api/ocr', upload.single('image'), async (req, res) => {
  console.log('📸 Received OCR request');

  if (!req.file) {
    console.error('❌ No image uploaded');
    return res.status(400).json({error: 'No image uploaded'});
  }

  console.log(`📂 Uploaded file path: ${req.file.path}`);

  try {
    // Read file as Base64
    const imageBuffer = await fs.readFile(req.file.path);
    const imageBase64 = imageBuffer.toString('base64');

    // Process OCR
    const {
      data: {text},
    } = await Tesseract.recognize(Buffer.from(imageBase64, 'base64'), 'eng');

    console.log('✅ OCR result:', text);

    // Delete file after processing
    await fs.unlink(req.file.path);

    const cleanedText = text.replace(/\s+/g, ' ').trim(); // ✅ Remove extra spaces
    const title =
      cleanedText.length > 20
        ? cleanedText.substring(0, 20) + '...'
        : cleanedText; // ✅ Get first 20 chars

    res.json({title, text});
  } catch (error) {
    console.error('❌ OCR processing failed:', error);
    res
      .status(500)
      .json({error: 'OCR processing failed', details: error.message});
  }
});

const startServer = () => {
  app.listen(5000, () =>
    console.log('🚀 Server running on http://localhost:5000'),
  );
};

startServer();
module.exports = {startServer, passport};
