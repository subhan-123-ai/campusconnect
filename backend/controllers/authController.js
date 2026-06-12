const User = require('../models/User');
const University = require('../models/University');
const jwt = require('jsonwebtoken');
const { isValidEmail, isValidPassword } = require('../utils/validators');

// Generate JWT
const generateToken = (userId, role) => {
  return jwt.sign({ id: userId, role }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
};

// Register
exports.register = async (req, res) => {
  try {
    const { name, email, password, department, semester, universityId } = req.body;

    // Validation
    if (!name || !email || !password || !department || !semester || !universityId) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required',
      });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format',
      });
    }

    if (!isValidPassword(password)) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long',
      });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'Email already registered',
      });
    }

    // Check if university exists
    const university = await University.findById(universityId);
    if (!university) {
      return res.status(404).json({
        success: false,
        message: 'University not found',
      });
    }

    // Create user
    const user = new User({
      name,
      email,
      password,
      department,
      semester,
      university: universityId,
    });

    await user.save();

    // Generate token
    const token = generateToken(user._id, user.role);

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        semester: user.semester,
        university: user.university,
      },
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Registration failed',
    });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { email, password, universityId } = req.body;

    // Validation
    if (!email || !password || !universityId) {
      return res.status(400).json({
        success: false,
        message: 'Email, password, and university are required',
      });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format',
      });
    }

    // Find user
    const user = await User.findOne({ email }).populate('university');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    if (user.role === 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Admins must use the Admin Login portal',
      });
    }

    // Check if user is banned
    if (user.isBanned) {
      return res.status(403).json({
        success: false,
        message: 'Your account has been banned',
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Your account is inactive',
      });
    }

    // Compare password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Verify university match (super admins can login with any university)
    if (
      !user.isSuperAdmin &&
      user.university._id.toString() !== universityId
    ) {
      return res.status(401).json({
        success: false,
        message: 'University mismatch. Please select the correct university.',
      });
    }

    // Generate token
    const token = generateToken(user._id, user.role);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isSuperAdmin: user.isSuperAdmin || false,
        university: user.university,
        department: user.department,
        semester: user.semester,
        profileImage: user.profileImage,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Login failed',
    });
  }
};

// Admin Login (email + password only, no university)
exports.adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required',
      });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format',
      });
    }

    const user = await User.findOne({ email }).populate('university');
    if (!user || user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Invalid admin credentials',
      });
    }

    if (user.isBanned) {
      return res.status(403).json({
        success: false,
        message: 'Your admin account has been banned',
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Your admin account is inactive',
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid admin credentials',
      });
    }

    const token = generateToken(user._id, user.role);

    res.status(200).json({
      success: true,
      message: 'Admin login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isSuperAdmin: true,
        isAdminSession: true,
        university: user.university,
        department: user.department,
        semester: user.semester,
        profileImage: user.profileImage,
      },
    });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Admin login failed',
    });
  }
};

// Get User Profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('university')
      .select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isSuperAdmin: user.isSuperAdmin || false,
        university: user.university,
        department: user.department,
        semester: user.semester,
        profileImage: user.profileImage,
        bio: user.bio,
      },
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch profile',
    });
  }
};

// Update User Profile
exports.updateProfile = async (req, res) => {
  try {
    const { name, bio, profileImage } = req.body;

    const updateData = {};
    if (name) updateData.name = name;
    if (bio !== undefined) updateData.bio = bio;
    if (profileImage) updateData.profileImage = profileImage;

    const user = await User.findByIdAndUpdate(req.user.id, updateData, {
      new: true,
    }).select('-password');

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user,
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update profile',
    });
  }
};

// Get All Universities
exports.getAllUniversities = async (req, res) => {
  try {
    const universities = await University.find().sort({ name: 1 });

    res.status(200).json({
      success: true,
      universities,
    });
  } catch (error) {
    console.error('Get universities error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch universities',
    });
  }
};

// Get Students by Filters (for Study Partner)
exports.getStudents = async (req, res) => {
  try {
    const { department, semester, subject } = req.query;

    const user = await User.findById(req.user.id);

    const filter = {
      university: user.university,
      _id: { $ne: req.user.id },
      isActive: true,
      isBanned: false,
      role: 'student',
    };

    if (department) filter.department = department;
    if (semester) filter.semester = parseInt(semester);

    const students = await User.find(filter)
      .select('name email department semester profileImage bio')
      .limit(50);

    res.status(200).json({
      success: true,
      students,
    });
  } catch (error) {
    console.error('Get students error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch students',
    });
  }
};