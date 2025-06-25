const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const userRoutes = require('./routes/userRoutes');
const db = require('../server/db/db');
const profileRoutes = require('./routes/profileRoutes');
const lecturerRoutes = require('./routes/lecturerRoutes');
const {ensureAuthenticated} = require('./middleware/authMiddleware');
const categoryRoutes = require('./routes/categoryRoutes');
const multer = require('multer');
const Tesseract = require('tesseract.js');
const fs = require('fs').promises;
const {spawn} = require('child_process');
const sharp = require('sharp');

const app = express();

function runPythonOCR(imagePath) {
  return new Promise((resolve, reject) => {
    console.log('🐍 Running Python OCR:', imagePath);
    const python = spawn('python', ['ocr_processor.py', imagePath]);

    let result = '';

    python.stdout.on('data', data => {
      console.log('📤 Python output:', data.toString());
      result += data.toString();
    });

    python.stderr.on('data', data => {
      console.error('❌ Python error:', data.toString());
    });

    python.on('close', code => {
      console.log('📥 Python exited with code:', code);
      if (code === 0) resolve(result.trim());
      else reject(new Error('Python script failed'));
    });
  });
}

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
    allowedHeaders: ['Content-Type', 'Authorization'], // Allow necessary headers
  }),
);

app.get('/api/user', ensureAuthenticated, async (req, res) => {
  try {
    const userId = req.user.userId;
    if (!userId) return res.status(401).json({message: 'Unauthorized'});

    const [user] = await db
      .promise()
      .query('SELECT username FROM users WHERE id = ?', [userId]);

    if (user.length === 0)
      return res.status(404).json({message: 'User not found'});

    res.json(user[0]);
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
    const sql = 'SELECT * FROM users WHERE email = ? ';
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
app.use('/api', categoryRoutes);
app.use('/uploads', express.static('uploads'));
app.use('/api/lecturer', lecturerRoutes);

const upload = multer({dest: 'uploads/'});

async function fallbackTesseractOCR(imagePath) {
  const buffer = await sharp(imagePath).grayscale().toBuffer();
  const {
    data: {text},
  } = await Tesseract.recognize(buffer, 'eng');
  return text;
}
app.post('/api/ocr', upload.single('image'), async (req, res) => {
  if (!req.file) return res.status(400).json({error: 'No image uploaded'});

  const imagePath = req.file.path;
  let text = '';

  try {
    text = await runPythonOCR(imagePath);

    if (!text || text.trim().length < 5 || !/[a-zA-Z]{3,}/.test(text)) {
      console.warn('⚠️ Weak Python OCR result. Fallback to Tesseract...');
      text = await fallbackTesseractOCR(imagePath);
    }

    const lines = text
      .split('\n')
      .map(line => line.trim())
      .filter(Boolean); // clean and remove empty lines
    const cleaned = lines.join(' '); // Combine full cleaned content

    let title = lines[0] || 'Untitled Note';
    if (title.length > 60) {
      title = title.slice(0, 60) + '...';
    }

    res.json({title, text: cleaned});
  } catch (err) {
    console.error('❌ OCR failed:', err);
    res.status(500).json({error: 'OCR failed', details: err.message});
  } finally {
    fs.unlink(imagePath).catch(e =>
      console.warn('⚠️ Failed to delete temp file:', e.message),
    );
  }
});

const startServer = () => {
  app.listen(5000, () =>
    console.log('🚀 Server running on http://localhost:5000'),
  );
};

startServer();
module.exports = {startServer, passport};
