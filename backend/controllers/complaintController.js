const Complaint = require('../models/Complaint');
const User = require('../models/User');
const Notification = require('../models/Notification');
const { isValidComplaintCategory } = require('../utils/validators');

// Submit Complaint
exports.submitComplaint = async (req, res) => {
  try {
    const { category, description, anonymous, priority } = req.body;

    if (!category || !description) {
      return res.status(400).json({
        success: false,
        message: 'Category and description are required',
      });
    }

    if (!isValidComplaintCategory(category)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid complaint category',
      });
    }

    if (description.trim().length < 10) {
      return res.status(400).json({
        success: false,
        message: 'Description must be at least 10 characters long',
      });
    }

    const user = await User.findById(req.user.id);

    const complaint = new Complaint({
      category,
      description,
      anonymous: anonymous || false,
      submittedBy: req.user.id,
      university: user.university,
      priority: priority || 'Low',
    });

    await complaint.save();

    // Notify admins
    const admins = await User.find({
      university: user.university,
      role: 'admin',
    });

    for (let admin of admins) {
      await Notification.create({
        receiver: admin._id,
        message: `New complaint received: ${category}`,
        type: 'complaint',
        relatedId: complaint._id,
        relatedModel: 'Complaint',
      });
    }

    res.status(201).json({
      success: true,
      message: 'Complaint submitted successfully',
      complaint,
    });
  } catch (error) {
    console.error('Submit complaint error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to submit complaint',
    });
  }
};

// Get My Complaints
exports.getMyComplaints = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const skip = (page - 1) * limit;

    const complaints = await Complaint.find({
      submittedBy: req.user.id,
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Complaint.countDocuments({
      submittedBy: req.user.id,
    });

    res.status(200).json({
      success: true,
      complaints,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get my complaints error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch complaints',
    });
  }
};

// Get All Complaints (Admin)
exports.getAllComplaints = async (req, res) => {
  try {
    const { status, category, page = 1, limit = 10 } = req.query;

    const user = await User.findById(req.user.id);

    const filter = {
      university: user.university,
    };

    if (status) filter.status = status;
    if (category) filter.category = category;

    const skip = (page - 1) * limit;

    const complaints = await Complaint.find(filter)
      .populate('submittedBy', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Complaint.countDocuments(filter);

    res.status(200).json({
      success: true,
      complaints,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get all complaints error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch complaints',
    });
  }
};

// Get Complaint Detail
exports.getComplaintDetail = async (req, res) => {
  try {
    const { complaintId } = req.params;

    const complaint = await Complaint.findById(complaintId)
      .populate('submittedBy', 'name email')
      .populate('resolvedBy', 'name email');

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found',
      });
    }

    // Check permissions
    if (
      complaint.submittedBy._id.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to view this complaint',
      });
    }

    res.status(200).json({
      success: true,
      complaint,
    });
  } catch (error) {
    console.error('Get complaint detail error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch complaint',
    });
  }
};

// Update Complaint Status (Admin)
exports.updateComplaintStatus = async (req, res) => {
  try {
    const { complaintId } = req.params;
    const { status, adminRemarks } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Status is required',
      });
    }

    const validStatuses = ['Pending', 'Resolved', 'Rejected'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status',
      });
    }

    const complaint = await Complaint.findByIdAndUpdate(
      complaintId,
      {
        status,
        adminRemarks: adminRemarks || '',
        resolvedBy: req.user.id,
      },
      { new: true }
    );

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found',
      });
    }

    // Notify complaint submitter
    const submitter = await User.findById(complaint.submittedBy);
    await Notification.create({
      receiver: complaint.submittedBy,
      message: `Your complaint has been ${status.toLowerCase()}`,
      type: 'complaint',
      relatedId: complaint._id,
      relatedModel: 'Complaint',
    });

    res.status(200).json({
      success: true,
      message: 'Complaint status updated successfully',
      complaint,
    });
  } catch (error) {
    console.error('Update complaint status error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update complaint status',
    });
  }
};