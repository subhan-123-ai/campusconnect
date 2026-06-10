const Resource = require('../models/Resource');
const User = require('../models/User');
const Notification = require('../models/Notification');

// Upload Resource
exports.uploadResource = async (req, res) => {
  try {
    const { title, subject, semester, description, fileUrl } = req.body;

    if (!title || !subject || !semester || !fileUrl) {
      return res.status(400).json({
        success: false,
        message: 'Title, subject, semester, and file URL are required',
      });
    }

    if (semester < 1 || semester > 8) {
      return res.status(400).json({
        success: false,
        message: 'Semester must be between 1 and 8',
      });
    }

    const user = await User.findById(req.user.id);

    const resource = new Resource({
      title,
      subject,
      semester,
      description: description || '',
      fileUrl,
      uploadedBy: req.user.id,
      university: user.university,
    });

    await resource.save();

    // Notify users of same university
    // This can be optimized later

    res.status(201).json({
      success: true,
      message: 'Resource uploaded successfully',
      resource,
    });
  } catch (error) {
    console.error('Upload resource error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to upload resource',
    });
  }
};

// Get Resources (with filters)
exports.getResources = async (req, res) => {
  try {
    const { subject, semester, page = 1, limit = 10 } = req.query;

    const user = await User.findById(req.user.id);

    const filter = {
      university: user.university,
      isApproved: true,
    };

    if (subject) filter.subject = new RegExp(subject, 'i');
    if (semester) filter.semester = parseInt(semester);

    const skip = (page - 1) * limit;

    const resources = await Resource.find(filter)
      .populate('uploadedBy', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Resource.countDocuments(filter);

    res.status(200).json({
      success: true,
      resources,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get resources error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch resources',
    });
  }
};

// Download Resource
exports.downloadResource = async (req, res) => {
  try {
    const { resourceId } = req.params;

    const resource = await Resource.findByIdAndUpdate(
      resourceId,
      { $inc: { downloads: 1 } },
      { new: true }
    );

    if (!resource) {
      return res.status(404).json({
        success: false,
        message: 'Resource not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Download count updated',
      resource,
    });
  } catch (error) {
    console.error('Download resource error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to download resource',
    });
  }
};

// Get My Resources
exports.getMyResources = async (req, res) => {
  try {
    const resources = await Resource.find({ uploadedBy: req.user.id })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      resources,
    });
  } catch (error) {
    console.error('Get my resources error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch your resources',
    });
  }
};

// Delete Resource
exports.deleteResource = async (req, res) => {
  try {
    const { resourceId } = req.params;

    const resource = await Resource.findById(resourceId);

    if (!resource) {
      return res.status(404).json({
        success: false,
        message: 'Resource not found',
      });
    }

    // Only uploader or admin can delete
    if (
      resource.uploadedBy.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this resource',
      });
    }

    await Resource.findByIdAndDelete(resourceId);

    res.status(200).json({
      success: true,
      message: 'Resource deleted successfully',
    });
  } catch (error) {
    console.error('Delete resource error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to delete resource',
    });
  }
};