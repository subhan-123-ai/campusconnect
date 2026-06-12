const Event = require('../models/Event');
const User = require('../models/User');
const Notification = require('../models/Notification');

// Create Event
exports.createEvent = async (req, res) => {
  try {
    const { title, description, location, date, image } = req.body;

    if (!title || !description || !location || !date) {
      return res.status(400).json({
        success: false,
        message: 'Title, description, location, and date are required',
      });
    }

    const eventDate = new Date(date);
    if (eventDate < new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Event date must be in the future',
      });
    }

    const user = await User.findById(req.user.id);

    const event = new Event({
      title,
      description,
      location,
      date: eventDate,
      image: image || null,
      organizer: req.user.id,
      university: user.university,
      isApproved: false,
    });

    await event.save();

    const admins = await User.find({
      $or: [{ university: user.university, role: 'admin' }, { isSuperAdmin: true }],
    });

    for (const admin of admins) {
      await Notification.create({
        receiver: admin._id,
        message: `New event pending approval: ${title}`,
        type: 'event',
        relatedId: event._id,
        relatedModel: 'Event',
      });
    }

    res.status(201).json({
      success: true,
      message: 'Event created and pending admin approval',
      event,
    });
  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create event',
    });
  }
};

// Get Events (with filters)
exports.getEvents = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const user = await User.findById(req.user.id);

    const skip = (page - 1) * limit;

    const events = await Event.find({
      university: user.university,
      isApproved: true,
      date: { $gte: new Date() }, // Only future events
    })
      .populate('organizer', 'name email')
      .sort({ date: 1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Event.countDocuments({
      university: user.university,
      isApproved: true,
      date: { $gte: new Date() },
    });

    res.status(200).json({
      success: true,
      events,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch events',
    });
  }
};

// Get My Events
exports.getMyEvents = async (req, res) => {
  try {
    const events = await Event.find({ organizer: req.user.id })
      .sort({ date: 1 });

    res.status(200).json({
      success: true,
      events,
    });
  } catch (error) {
    console.error('Get my events error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch your events',
    });
  }
};

// Register for Event
exports.registerForEvent = async (req, res) => {
  try {
    const { eventId } = req.params;

    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    // Check if already registered
    if (event.registeredUsers.some((id) => id.toString() === req.user.id)) {
      return res.status(400).json({
        success: false,
        message: 'You are already registered for this event',
      });
    }

    event.registeredUsers.push(req.user.id);
    event.registrations += 1;
    await event.save();

    // Send notification
    const user = await User.findById(req.user.id);
    await Notification.create({
      receiver: event.organizer,
      message: `${user.name} registered for your event: ${event.title}`,
      type: 'event',
      relatedId: event._id,
      relatedModel: 'Event',
    });

    res.status(200).json({
      success: true,
      message: 'Registered for event successfully',
      event,
    });
  } catch (error) {
    console.error('Register for event error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to register for event',
    });
  }
};

// Unregister from Event
exports.unregisterFromEvent = async (req, res) => {
  try {
    const { eventId } = req.params;

    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    if (!event.registeredUsers.some((id) => id.toString() === req.user.id)) {
      return res.status(400).json({
        success: false,
        message: 'You are not registered for this event',
      });
    }

    event.registeredUsers = event.registeredUsers.filter(
      (id) => id.toString() !== req.user.id
    );
    event.registrations = Math.max(0, event.registrations - 1);
    await event.save();

    res.status(200).json({
      success: true,
      message: 'Unregistered from event successfully',
      event,
    });
  } catch (error) {
    console.error('Unregister from event error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to unregister from event',
    });
  }
};

// Delete Event
exports.deleteEvent = async (req, res) => {
  try {
    const { eventId } = req.params;

    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    if (event.organizer.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this event',
      });
    }

    await Event.findByIdAndDelete(eventId);

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