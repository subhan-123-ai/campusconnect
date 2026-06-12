const fs = require('fs');
const path = require('path');
const Resource = require('../models/Resource');
const User = require('../models/User');
const Notification = require('../models/Notification');
const { getPublicFileUrl } = require('../utils/fileUrl');
const { isValidDepartment } = require('../utils/validators');

const formatResource = (req, resource) => {
  const obj = resource.toObject ? resource.toObject() : resource;
  return {
    ...obj,
    fileUrl: getPublicFileUrl(req, obj.fileUrl),
  };
};

// Upload Resource (with file)
exports.uploadResource = async (req, res) => {
  try {
    const { title, subject, department, semester, description } = req.body;

    if (!title || !subject || !department || !semester) {
      return res.status(400).json({
        success: false,
        message: 'Title, subject, department, and semester are required',
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a PDF or image file',
      });
    }

    const semesterNum = parseInt(semester, 10);
    if (semesterNum < 1 || semesterNum > 8) {
      return res.status(400).json({
        success: false,
        message: 'Semester must be between 1 and 8',
      });
    }

    if (!isValidDepartment(department)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid department. Choose from AI, CS, SE, DS, BBA, or EE',
      });
    }

    const user = await User.findById(req.user.id);
    const fileUrl = `/uploads/resources/${req.file.filename}`;

    const resource = new Resource({
      title,
      subject,
      department,
      semester: semesterNum,
      description: description || '',
      fileUrl,
      fileName: req.file.originalname,
      uploadedBy: req.user.id,
      university: user.university,
      isApproved: false,
    });

    await resource.save();

    const admins = await User.find({
      role: 'admin',
    });

    for (const admin of admins) {
      await Notification.create({
        receiver: admin._id,
        message: `New resource pending approval: ${title}`,
        type: 'resource',
        relatedId: resource._id,
        relatedModel: 'Resource',
      });
    }

    res.status(201).json({
      success: true,
      message: 'Resource uploaded and pending admin approval',
      resource: formatResource(req, resource),
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
    const { subject, department, semester, page = 1, limit = 10 } = req.query;

    const user = await User.findById(req.user.id);

    const filter = {
      university: user.university,
      isApproved: true,
    };

    if (subject) filter.subject = new RegExp(subject, 'i');
    if (department) filter.department = department;
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
      resources: resources.map((r) => formatResource(req, r)),
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

// Download Resource — increment count and return file URL
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

    if (!resource.isApproved) {
      return res.status(403).json({
        success: false,
        message: 'This resource is not approved yet',
      });
    }

    const downloadUrl = getPublicFileUrl(req, resource.fileUrl);

    res.status(200).json({
      success: true,
      message: 'Download ready',
      downloadUrl,
      fileName: resource.fileName || resource.title,
      resource: formatResource(req, resource),
    });
  } catch (error) {
    console.error('Download resource error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to download resource',
    });
  }
};

// Stream file directly for download
exports.downloadResourceFile = async (req, res) => {
  try {
    const { resourceId } = req.params;

    const resource = await Resource.findById(resourceId);

    if (!resource) {
      return res.status(404).json({
        success: false,
        message: 'Resource not found',
      });
    }

    if (!resource.isApproved) {
      return res.status(403).json({
        success: false,
        message: 'This resource is not approved yet',
      });
    }

    await Resource.findByIdAndUpdate(resourceId, { $inc: { downloads: 1 } });

    if (resource.fileUrl.startsWith('http')) {
      return res.redirect(resource.fileUrl);
    }

    const storedName = path.basename(resource.fileUrl);
    const filePath = path.join(__dirname, '../uploads/resources', storedName);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: 'File not found on server',
      });
    }

    const downloadName = resource.fileName || storedName;
    res.download(filePath, downloadName);
  } catch (error) {
    console.error('Download resource file error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to download file',
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
      resources: resources.map((r) => formatResource(req, r)),
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

    if (
      resource.uploadedBy.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this resource',
      });
    }

    if (resource.fileUrl && !resource.fileUrl.startsWith('http')) {
      const storedName = path.basename(resource.fileUrl);
      const filePath = path.join(__dirname, '../uploads/resources', storedName);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
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
