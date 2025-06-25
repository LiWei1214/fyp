const express = require('express');
const router = express.Router();
const multer = require('multer');
const {
  uploadMaterial,
  getUploadedMaterials,
  deleteMaterial,
  updateMaterial,
  getMaterialById,
  getQuizzesByCategory,
  getQuizQuestionsByMaterialId,
} = require('../controller/lecturerController');
const {ensureAuthenticated} = require('../middleware/authMiddleware');
const path = require('path');

// Set up multer for file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads');
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  },
});
const upload = multer({storage});

// Upload material route (now at /api/lecturer/materials)
router.post(
  '/materials',
  ensureAuthenticated,
  upload.single('file'),
  uploadMaterial,
);
router.get('/materials', ensureAuthenticated, getUploadedMaterials);
router.delete('/materials/:id', ensureAuthenticated, deleteMaterial);
router.get('/materials/:id', ensureAuthenticated, getMaterialById);
router.put(
  '/materials/:id',
  ensureAuthenticated,
  upload.single('file'),
  updateMaterial,
);

router.get('/by-material/:materialId', getQuizQuestionsByMaterialId);
router.get(
  '/categories/:categoryId/quizzes',
  ensureAuthenticated,
  getQuizzesByCategory,
);

module.exports = router;
