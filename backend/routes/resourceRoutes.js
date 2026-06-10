const express = require('express');
const resourceController = require('../controllers/resourceController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/upload', authMiddleware, resourceController.uploadResource);
router.get('/', authMiddleware, resourceController.getResources);
router.get('/my-resources', authMiddleware, resourceController.getMyResources);
router.post('/:resourceId/download', authMiddleware, resourceController.downloadResource);
router.delete('/:resourceId', authMiddleware, resourceController.deleteResource);

module.exports = router;