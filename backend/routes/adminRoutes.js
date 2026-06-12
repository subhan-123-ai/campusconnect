const express = require('express');
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

const router = express.Router();

router.use(authMiddleware, adminMiddleware);

router.get('/dashboard/stats', adminController.getDashboardStats);
router.get('/universities', adminController.getUniversities);
router.post('/universities', adminController.createUniversity);
router.delete('/universities/:universityId', adminController.deleteUniversity);

router.get('/users', adminController.getAllUsers);
router.patch('/users/:userId/ban', adminController.banUser);
router.patch('/users/:userId/unban', adminController.unbanUser);
router.patch('/users/:userId/restrict', adminController.restrictUser);
router.patch('/users/:userId/activate', adminController.activateUser);
router.delete('/users/:userId', adminController.deleteUser);

router.get('/resources', adminController.getAllResources);
router.get('/resources/unapproved', adminController.getUnapprovedResources);
router.patch('/resources/:resourceId/approve', adminController.approveResource);
router.patch('/resources/:resourceId/reject', adminController.rejectResource);
router.delete('/resources/:resourceId', adminController.deleteResource);

router.get('/events', adminController.getAllEvents);
router.get('/events/unapproved', adminController.getUnapprovedEvents);
router.patch('/events/:eventId/approve', adminController.approveEvent);
router.patch('/events/:eventId/reject', adminController.rejectEvent);
router.delete('/events/:eventId', adminController.deleteEvent);

module.exports = router;
