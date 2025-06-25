const express = require('express');
const router = express.Router();
const {
  getCategories,
  getUserCategories,
  addUserCategories,
  getMaterials,
  deleteUserCategory,
} = require('../controller/categoryController');
const {uploadMaterial} = require('../controller/lecturerController');
const {ensureAuthenticated} = require('../middleware/authMiddleware');

router.get('/categories', ensureAuthenticated, getCategories);
router.get('/materials', ensureAuthenticated, getMaterials);
router.post('/materials', ensureAuthenticated, uploadMaterial);

router.get('/user-categories', ensureAuthenticated, getUserCategories);
router.post('/user-categories', ensureAuthenticated, addUserCategories);
router.delete(
  '/user-categories/:categoryId',
  ensureAuthenticated,
  deleteUserCategory,
);

module.exports = router;
