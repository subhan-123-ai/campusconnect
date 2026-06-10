const express = require('express');
const complaintController = require('../controllers/complaintController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

const router = express.Router();

router.post('/submit', authMiddleware, complaintController.submitComplaint);
router.get('/my-complaints', authMiddleware, complaintController.getMyComplaints);
router.get(
  '/all',
  authMiddleware,
  adminMiddleware,
  complaintController.getAllComplaints
);
router.get('/:complaintId', authMiddleware, complaintController.getComplaintDetail);
router.patch(
  '/:complaintId/status',
  authMiddleware,
  adminMiddleware,
  complaintController.updateComplaintStatus
);

module.exports = router;