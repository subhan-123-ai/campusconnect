const express = require('express');
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

const router = express.Router();

// All admin routes are protected
router.use(authMiddleware, adminMiddleware);

router.get('/dashboard/stats', adminController.getDashboardStats);
router.get('/users', adminController.getAllUsers);
router.patch('/users/:userId/ban', adminController.banUser);
router.patch('/users/:userId/unban', adminController.unbanUser);
router.get('/resources/unapproved', adminController.getUnapprovedResources);
router.patch('/resources/:resourceId/approve', adminController.approveResource);
router.patch('/resources/:resourceId/reject', adminController.rejectResource);

module.exports = router;