const User = require('../models/User');
const Resource = require('../models/Resource');
const Event = require('../models/Event');
const Complaint = require('../models/Complaint');

// Get Dashboard Stats
exports.getDashboardStats = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    const userCount = await User.countDocuments({
      university: user.university,
      role: 'student',
    });

    const resourceCount = await Resource.countDocuments({
      university: user.university,
    });

    const eventCount = await Event.countDocuments({
      university: user.university,
    });

    const pendingComplaints = await Complaint.countDocuments({
      university: user.university,
      status: 'Pending',
    });

    res.status(200).json({
      success: true,
      stats: {
        totalUsers: userCount,
        totalResources: resourceCount,
        totalEvents: eventCount,
        pendingComplaints,
      },
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch dashboard stats',
    });
  }
};

// Get All Users (Admin)
exports.getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const adminUser = await User.findById(req.user.id);

    const skip = (page - 1) * limit;

    const users = await User.find({
      university: adminUser.university,
    })
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await User.countDocuments({
      university: adminUser.university,
    });

    res.status(200).json({
      success: true,
      users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch users',
    });
  }
};

// Ban User
exports.banUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findByIdAndUpdate(
      userId,
      { isBanned: true },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'User banned successfully',
      user,
    });
  } catch (error) {
    console.error('Ban user error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to ban user',
    });
  }
};

// Unban User
exports.unbanUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findByIdAndUpdate(
      userId,
      { isBanned: false },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'User unbanned successfully',
      user,
    });
  } catch (error) {
    console.error('Unban user error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to unban user',
    });
  }
};

// Approve Resource
exports.approveResource = async (req, res) => {
  try {
    const { resourceId } = req.params;

    const resource = await Resource.findByIdAndUpdate(
      resourceId,
      { isApproved: true },
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
      message: 'Resource approved',
      resource,
    });
  } catch (error) {
    console.error('Approve resource error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to approve resource',
    });
  }
};

// Reject Resource
exports.rejectResource = async (req, res) => {
  try {
    const { resourceId } = req.params;

    await Resource.findByIdAndDelete(resourceId);

    res.status(200).json({
      success: true,
      message: 'Resource rejected and deleted',
    });
  } catch (error) {
    console.error('Reject resource error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to reject resource',
    });
  }
};

// Get Unapproved Resources
exports.getUnapprovedResources = async (req, res) => {
  try {
    const adminUser = await User.findById(req.user.id);

    const resources = await Resource.find({
      university: adminUser.university,
      isApproved: false,
    })
      .populate('uploadedBy', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      resources,
    });
  } catch (error) {
    console.error('Get unapproved resources error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch resources',
    });
  }
};