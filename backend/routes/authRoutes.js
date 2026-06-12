const express = require('express');
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/admin/login', authController.adminLogin);
router.get('/profile', authMiddleware, authController.getProfile);
router.put('/profile', authMiddleware, authController.updateProfile);
router.get('/universities', authController.getAllUniversities);
router.get('/students', authMiddleware, authController.getStudents);

module.exports = router;