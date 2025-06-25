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
  getLists,
  createList,
  updateList,
  deleteList,
  getTodosWithType,
  getQuizByCategoryForStudent,
  getStudentQuizByMaterialId,
} = require('../controller/studentController');

router.get('/notes', ensureAuthenticated, getNotes);
router.post('/notes', ensureAuthenticated, createNote);
router.put('/notes/:id', ensureAuthenticated, updateNote);
router.delete('/notes/:id', ensureAuthenticated, deleteNote);

router.get('/todos', ensureAuthenticated, getTodos);
router.get('/todos/with-type', ensureAuthenticated, getTodosWithType);
router.post('/todos', ensureAuthenticated, createTodo);
router.put('/todos/:id', ensureAuthenticated, updateTodo);
router.delete('/todos/:id', ensureAuthenticated, deleteTodo);

router.get('/lists', ensureAuthenticated, getLists);
router.post('/lists', ensureAuthenticated, createList);
router.put('/lists/:id', ensureAuthenticated, updateList);
router.delete('/lists/:id', ensureAuthenticated, deleteList);

router.get('/quizzes/by-material/:materialId', getStudentQuizByMaterialId);
router.get(
  '/quizzes/:materialId',
  ensureAuthenticated,
  getQuizByCategoryForStudent,
);

module.exports = router;
