const express = require('express');
const studyRequestController = require('../controllers/studyRequestController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/send', authMiddleware, studyRequestController.sendStudyRequest);
router.get(
  '/my-requests',
  authMiddleware,
  studyRequestController.getMyStudyRequests
);
router.get(
  '/sent-requests',
  authMiddleware,
  studyRequestController.getMySentRequests
);
router.patch(
  '/:requestId/accept',
  authMiddleware,
  studyRequestController.acceptStudyRequest
);
router.patch(
  '/:requestId/reject',
  authMiddleware,
  studyRequestController.rejectStudyRequest
);
router.delete(
  '/:requestId/cancel',
  authMiddleware,
  studyRequestController.cancelStudyRequest
);

module.exports = router;