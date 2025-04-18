const express = require('express');
const router = express.Router();
const {ensureAuthenticated} = require('../middleware/authMiddleware');
const {login, register, logout} = require('../controller/userController');

router.post('/register', register);

router.post('/login', login);

// Login Page
router.get('/login', (req, res) => {
  res.send('Login page');
});

router.post('/logout', logout);

//Student Route
const {
  getNotes,
  createNote,
  updateNote,
  deleteNote,
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo,
} = require('../controller/studentController');

router.get('/notes', ensureAuthenticated, getNotes);
router.post('/notes', ensureAuthenticated, createNote);
router.put('/notes/:id', ensureAuthenticated, updateNote);
router.delete('/notes/:id', ensureAuthenticated, deleteNote);

router.get('/todos', ensureAuthenticated, getTodos);
router.post('/todos', ensureAuthenticated, createTodo);
router.put('/todos', ensureAuthenticated, updateTodo);
router.delete('/todos', ensureAuthenticated, deleteTodo);

module.exports = router;
