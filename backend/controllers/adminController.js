const User = require('../models/User');
const Resource = require('../models/Resource');
const Event = require('../models/Event');
const Complaint = require('../models/Complaint');
const University = require('../models/University');
const {
  getAdminUser,
  isSuperAdmin,
  hasGlobalAccess,
  getUniversityFilter,
  canManageUser,
} = require('../utils/adminScope');

exports.getDashboardStats = async (req, res) => {
  try {
    const adminUser = await getAdminUser(req.user.id);
    const uniFilter = getUniversityFilter(adminUser, req.query.universityId);

    const [userCount, resourceCount, eventCount, pendingComplaints, pendingResources, pendingEvents] =
      await Promise.all([
        User.countDocuments({ ...uniFilter, role: 'student' }),
        Resource.countDocuments(uniFilter),
        Event.countDocuments(uniFilter),
        Complaint.countDocuments({ ...uniFilter, status: 'Pending' }),
        Resource.countDocuments({ ...uniFilter, isApproved: false }),
        Event.countDocuments({ ...uniFilter, isApproved: false }),
      ]);

    res.status(200).json({
      success: true,
      stats: {
        totalUsers: userCount,
        totalResources: resourceCount,
        totalEvents: eventCount,
        pendingComplaints,
        pendingResources,
        pendingEvents,
        isSuperAdmin: isSuperAdmin(adminUser),
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

exports.getUniversities = async (req, res) => {
  try {
    const universities = await University.find().sort({ name: 1 });

    const universitiesWithStats = await Promise.all(
      universities.map(async (uni) => {
        const [users, resources, events, complaints] = await Promise.all([
          User.countDocuments({ university: uni._id, role: 'student' }),
          Resource.countDocuments({ university: uni._id }),
          Event.countDocuments({ university: uni._id }),
          Complaint.countDocuments({ university: uni._id, status: 'Pending' }),
        ]);
        return {
          ...uni.toObject(),
          stats: { users, resources, events, pendingComplaints: complaints },
        };
      })
    );

    res.status(200).json({
      success: true,
      universities: universitiesWithStats,
    });
  } catch (error) {
    console.error('Get universities error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch universities',
    });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 20, universityId } = req.query;
    const adminUser = await getAdminUser(req.user.id);
    const uniFilter = getUniversityFilter(adminUser, universityId);
    const skip = (page - 1) * limit;

    const users = await User.find(uniFilter)
      .select('-password')
      .populate('university', 'name shortName city')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await User.countDocuments(uniFilter);

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

exports.banUser = async (req, res) => {
  try {
    const adminUser = await getAdminUser(req.user.id);
    const targetUser = await User.findById(req.params.userId);

    if (!canManageUser(adminUser, targetUser)) {
      return res.status(403).json({
        success: false,
        message: 'You cannot ban this user',
      });
    }

    targetUser.isBanned = true;
    await targetUser.save();

    const user = await User.findById(targetUser._id)
      .select('-password')
      .populate('university', 'name shortName');

    res.status(200).json({
      success: true,
      message: 'User account restricted (banned)',
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

exports.unbanUser = async (req, res) => {
  try {
    const adminUser = await getAdminUser(req.user.id);
    const targetUser = await User.findById(req.params.userId);

    if (!canManageUser(adminUser, targetUser)) {
      return res.status(403).json({
        success: false,
        message: 'You cannot unban this user',
      });
    }

    targetUser.isBanned = false;
    await targetUser.save();

    const user = await User.findById(targetUser._id)
      .select('-password')
      .populate('university', 'name shortName');

    res.status(200).json({
      success: true,
      message: 'User ban lifted',
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

exports.restrictUser = async (req, res) => {
  try {
    const adminUser = await getAdminUser(req.user.id);
    const targetUser = await User.findById(req.params.userId);

    if (!canManageUser(adminUser, targetUser)) {
      return res.status(403).json({
        success: false,
        message: 'You cannot restrict this user',
      });
    }

    targetUser.isActive = false;
    await targetUser.save();

    const user = await User.findById(targetUser._id)
      .select('-password')
      .populate('university', 'name shortName');

    res.status(200).json({
      success: true,
      message: 'User account deactivated',
      user,
    });
  } catch (error) {
    console.error('Restrict user error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to restrict user',
    });
  }
};

exports.activateUser = async (req, res) => {
  try {
    const adminUser = await getAdminUser(req.user.id);
    const targetUser = await User.findById(req.params.userId);

    if (!canManageUser(adminUser, targetUser)) {
      return res.status(403).json({
        success: false,
        message: 'You cannot activate this user',
      });
    }

    targetUser.isActive = true;
    await targetUser.save();

    const user = await User.findById(targetUser._id)
      .select('-password')
      .populate('university', 'name shortName');

    res.status(200).json({
      success: true,
      message: 'User account activated',
      user,
    });
  } catch (error) {
    console.error('Activate user error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to activate user',
    });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const adminUser = await getAdminUser(req.user.id);
    const targetUser = await User.findById(req.params.userId);

    if (!canManageUser(adminUser, targetUser)) {
      return res.status(403).json({
        success: false,
        message: 'You cannot delete this user',
      });
    }

    await User.findByIdAndDelete(req.params.userId);

    res.status(200).json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to delete user',
    });
  }
};

exports.getAllResources = async (req, res) => {
  try {
    const { universityId, status } = req.query;
    const adminUser = await getAdminUser(req.user.id);
    const filter = getUniversityFilter(adminUser, universityId);

    if (status === 'pending') filter.isApproved = false;
    else if (status === 'approved') filter.isApproved = true;

    const resources = await Resource.find(filter)
      .populate('uploadedBy', 'name email')
      .populate('university', 'name shortName')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      resources,
    });
  } catch (error) {
    console.error('Get all resources error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch resources',
    });
  }
};

exports.getUnapprovedResources = async (req, res) => {
  req.query.status = 'pending';
  return exports.getAllResources(req, res);
};

exports.approveResource = async (req, res) => {
  try {
    const adminUser = await getAdminUser(req.user.id);
    const resource = await Resource.findById(req.params.resourceId);

    if (!resource) {
      return res.status(404).json({ success: false, message: 'Resource not found' });
    }

    if (!hasGlobalAccess(adminUser)) {
      const adminUni = (adminUser.university._id || adminUser.university).toString();
      if (resource.university.toString() !== adminUni) {
        return res.status(403).json({ success: false, message: 'Access denied' });
      }
    }

    resource.isApproved = true;
    await resource.save();

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

exports.rejectResource = async (req, res) => {
  try {
    const adminUser = await getAdminUser(req.user.id);
    const resource = await Resource.findById(req.params.resourceId);

    if (!resource) {
      return res.status(404).json({ success: false, message: 'Resource not found' });
    }

    if (!hasGlobalAccess(adminUser)) {
      const adminUni = (adminUser.university._id || adminUser.university).toString();
      if (resource.university.toString() !== adminUni) {
        return res.status(403).json({ success: false, message: 'Access denied' });
      }
    }

    await Resource.findByIdAndDelete(req.params.resourceId);

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

exports.deleteResource = async (req, res) => {
  return exports.rejectResource(req, res);
};

exports.getAllEvents = async (req, res) => {
  try {
    const { universityId, status } = req.query;
    const adminUser = await getAdminUser(req.user.id);
    const filter = getUniversityFilter(adminUser, universityId);

    if (status === 'pending') filter.isApproved = false;
    else if (status === 'approved') filter.isApproved = true;

    const events = await Event.find(filter)
      .populate('organizer', 'name email')
      .populate('university', 'name shortName')
      .sort({ date: 1 });

    res.status(200).json({
      success: true,
      events,
    });
  } catch (error) {
    console.error('Get all events error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch events',
    });
  }
};

exports.getUnapprovedEvents = async (req, res) => {
  req.query.status = 'pending';
  return exports.getAllEvents(req, res);
};

exports.approveEvent = async (req, res) => {
  try {
    const adminUser = await getAdminUser(req.user.id);
    const event = await Event.findById(req.params.eventId);

    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    if (!hasGlobalAccess(adminUser)) {
      const adminUni = (adminUser.university._id || adminUser.university).toString();
      if (event.university.toString() !== adminUni) {
        return res.status(403).json({ success: false, message: 'Access denied' });
      }
    }

    event.isApproved = true;
    await event.save();

    res.status(200).json({
      success: true,
      message: 'Event approved',
      event,
    });
  } catch (error) {
    console.error('Approve event error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to approve event',
    });
  }
};

exports.rejectEvent = async (req, res) => {
  try {
    const adminUser = await getAdminUser(req.user.id);
    const event = await Event.findById(req.params.eventId);

    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    if (!hasGlobalAccess(adminUser)) {
      const adminUni = (adminUser.university._id || adminUser.university).toString();
      if (event.university.toString() !== adminUni) {
        return res.status(403).json({ success: false, message: 'Access denied' });
      }
    }

    await Event.findByIdAndDelete(req.params.eventId);

    res.status(200).json({
      success: true,
      message: 'Event rejected and deleted',
    });
  } catch (error) {
    console.error('Reject event error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to reject event',
    });
  }
};

exports.deleteEvent = async (req, res) => {
  try {
    const adminUser = await getAdminUser(req.user.id);
    const event = await Event.findById(req.params.eventId);

    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    if (!hasGlobalAccess(adminUser)) {
      const adminUni = (adminUser.university._id || adminUser.university).toString();
      if (event.university.toString() !== adminUni) {
        return res.status(403).json({ success: false, message: 'Access denied' });
      }
    }

    await Event.findByIdAndDelete(req.params.eventId);

    res.status(200).json({
      success: true,
      message: 'Event deleted successfully',
    });
  } catch (error) {
    console.error('Delete event error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to delete event',
    });
  }
};

exports.createUniversity = async (req, res) => {
  try {
    const { name, shortName, city, logo } = req.body;

    if (!name || !shortName || !city) {
      return res.status(400).json({
        success: false,
        message: 'Name, short name, and city are required',
      });
    }

    const existing = await University.findOne({
      $or: [{ name }, { shortName }],
    });

    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'University with this name or short name already exists',
      });
    }

    const university = await University.create({
      name,
      shortName,
      city,
      logo: logo || null,
    });

    res.status(201).json({
      success: true,
      message: 'University created successfully',
      university,
    });
  } catch (error) {
    console.error('Create university error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create university',
    });
  }
};

exports.deleteUniversity = async (req, res) => {
  try {
    const { universityId } = req.params;

    const userCount = await User.countDocuments({ university: universityId });
    if (userCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete university with ${userCount} registered users`,
      });
    }

    const university = await University.findByIdAndDelete(universityId);
    if (!university) {
      return res.status(404).json({
        success: false,
        message: 'University not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'University deleted successfully',
    });
  } catch (error) {
    console.error('Delete university error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to delete university',
    });
  }
};
