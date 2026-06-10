const express = require('express');
const eventController = require('../controllers/eventController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/create', authMiddleware, eventController.createEvent);
router.get('/', authMiddleware, eventController.getEvents);
router.get('/my-events', authMiddleware, eventController.getMyEvents);
router.post('/:eventId/register', authMiddleware, eventController.registerForEvent);
router.post('/:eventId/unregister', authMiddleware, eventController.unregisterFromEvent);
router.delete('/:eventId', authMiddleware, eventController.deleteEvent);

module.exports = router;