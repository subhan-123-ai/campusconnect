const express = require('express');
const notificationController = require('../controllers/notificationController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', authMiddleware, notificationController.getMyNotifications);
router.patch(
  '/mark-all/read',
  authMiddleware,
  notificationController.markAllAsRead
);
router.patch(
  '/:notificationId/read',
  authMiddleware,
  notificationController.markAsRead
);
router.delete(
  '/:notificationId',
  authMiddleware,
  notificationController.deleteNotification
);

module.exports = router;
