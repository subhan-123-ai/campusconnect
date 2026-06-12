const express = require('express');
const resourceController = require('../controllers/resourceController');
const authMiddleware = require('../middleware/authMiddleware');
const { uploadResource } = require('../middleware/upload');

const router = express.Router();

router.post('/upload', authMiddleware, (req, res, next) => {
  uploadResource.single('file')(req, res, (err) => {
    if (err) {
      return res.status(400).json({
        success: false,
        message: err.message || 'File upload failed',
      });
    }
    next();
  });
}, resourceController.uploadResource);
router.get('/', authMiddleware, resourceController.getResources);
router.get('/my-resources', authMiddleware, resourceController.getMyResources);
router.get('/:resourceId/file', authMiddleware, resourceController.downloadResourceFile);
router.post('/:resourceId/download', authMiddleware, resourceController.downloadResource);
router.delete('/:resourceId', authMiddleware, resourceController.deleteResource);

module.exports = router;
