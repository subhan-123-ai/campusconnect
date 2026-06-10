const StudyRequest = require('../models/StudyRequest');
const User = require('../models/User');
const Notification = require('../models/Notification');

// Send Study Request
exports.sendStudyRequest = async (req, res) => {
  try {
    const { receiverId, subject, message } = req.body;

    if (!receiverId || !subject) {
      return res.status(400).json({
        success: false,
        message: 'Receiver ID and subject are required',
      });
    }

    if (receiverId === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'You cannot send a request to yourself',
      });
    }

    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return res.status(404).json({
        success: false,
        message: 'Receiver not found',
      });
    }

    const sender = await User.findById(req.user.id);

    // Check if request already exists
    const existingRequest = await StudyRequest.findOne({
      sender: req.user.id,
      receiver: receiverId,
      status: 'pending',
    });

    if (existingRequest) {
      return res.status(400).json({
        success: false,
        message: 'You already have a pending request with this user',
      });
    }

    const studyRequest = new StudyRequest({
      sender: req.user.id,
      receiver: receiverId,
      subject,
      message: message || '',
      university: sender.university,
    });

    await studyRequest.save();

    // Create notification
    await Notification.create({
      receiver: receiverId,
      message: `${sender.name} sent you a study request for ${subject}`,
      type: 'study-request',
      relatedId: studyRequest._id,
      relatedModel: 'StudyRequest',
    });

    res.status(201).json({
      success: true,
      message: 'Study request sent successfully',
      studyRequest,
    });
  } catch (error) {
    console.error('Send study request error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to send study request',
    });
  }
};

// Get My Study Requests (received)
exports.getMyStudyRequests = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;

    const filter = { receiver: req.user.id };
    if (status) filter.status = status;

    const skip = (page - 1) * limit;

    const requests = await StudyRequest.find(filter)
      .populate('sender', 'name email department semester profileImage bio')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await StudyRequest.countDocuments(filter);

    res.status(200).json({
      success: true,
      requests,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get my study requests error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch study requests',
    });
  }
};

// Get My Sent Study Requests
exports.getMySentRequests = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;

    const filter = { sender: req.user.id };
    if (status) filter.status = status;

    const skip = (page - 1) * limit;

    const requests = await StudyRequest.find(filter)
      .populate('receiver', 'name email department semester profileImage bio')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await StudyRequest.countDocuments(filter);

    res.status(200).json({
      success: true,
      requests,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get sent requests error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch sent requests',
    });
  }
};

// Accept Study Request
exports.acceptStudyRequest = async (req, res) => {
  try {
    const { requestId } = req.params;

    const request = await StudyRequest.findById(requestId);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found',
      });
    }

    if (request.receiver.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to accept this request',
      });
    }

    request.status = 'accepted';
    await request.save();

    // Create notification for sender
    const receiver = await User.findById(req.user.id);
    await Notification.create({
      receiver: request.sender,
      message: `${receiver.name} accepted your study request for ${request.subject}`,
      type: 'study-request',
      relatedId: request._id,
      relatedModel: 'StudyRequest',
    });

    res.status(200).json({
      success: true,
      message: 'Request accepted successfully',
      request,
    });
  } catch (error) {
    console.error('Accept study request error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to accept request',
    });
  }
};

// Reject Study Request
exports.rejectStudyRequest = async (req, res) => {
  try {
    const { requestId } = req.params;

    const request = await StudyRequest.findById(requestId);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found',
      });
    }

    if (request.receiver.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to reject this request',
      });
    }

    request.status = 'rejected';
    await request.save();

    res.status(200).json({
      success: true,
      message: 'Request rejected successfully',
      request,
    });
  } catch (error) {
    console.error('Reject study request error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to reject request',
    });
  }
};

// Cancel Study Request
exports.cancelStudyRequest = async (req, res) => {
  try {
    const { requestId } = req.params;

    const request = await StudyRequest.findById(requestId);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found',
      });
    }

    if (request.sender.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'You can only cancel your own requests',
      });
    }

    if (request.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'You can only cancel pending requests',
      });
    }

    await StudyRequest.findByIdAndDelete(requestId);

    res.status(200).json({
      success: true,
      message: 'Request cancelled successfully',
    });
  } catch (error) {
    console.error('Cancel study request error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to cancel request',
    });
  }
};