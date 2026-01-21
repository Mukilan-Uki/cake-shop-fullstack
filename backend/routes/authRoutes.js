const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// Middleware to protect routes
const protect = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized, no token provided'
      });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key-change-this');
    
    // Get user from database
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }
    
    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error.message);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired'
      });
    }
    
    return res.status(401).json({
      success: false,
      message: 'Not authorized'
    });
  }
};

// Middleware to log incoming requests
router.use((req, res, next) => {
  console.log(`📨 ${req.method} ${req.originalUrl}`);
  console.log('📦 Request body:', req.body);
  console.log('📋 Headers:', req.headers['content-type']);
  next();
});

// Register new user
router.post('/register', async (req, res) => {
  try {
    console.log('=== REGISTER REQUEST ===');
    console.log('Body:', req.body);
    
    // Check if body exists
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Request body is empty'
      });
    }

    const { name, email, phone, password } = req.body;

    // Validate required fields
    if (!name || !email || !phone || !password) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required: name, email, phone, password'
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format'
      });
    }

    // Phone validation (Sri Lankan format)
    const phoneRegex = /^07\d{8}$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid phone number. Use format: 07XXXXXXXX'
      });
    }

    // Password validation
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters'
      });
    }

    // Check if user exists
    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    // Create user
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      phone,
      password
    });

    // Generate token
    const token = jwt.sign({ 
      id: user._id,
      email: user.email,
      role: user.role
    }, process.env.JWT_SECRET || 'your-secret-key-change-this', {
      expiresIn: '30d'
    });

    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    console.log('✅ User registered:', user.email);
    
    res.status(201).json({
      success: true,
      message: 'Registration successful!',
      token,
      user: userResponse
    });

  } catch (error) {
    console.error('❌ Registration error:', error.message);
    console.error('Stack:', error.stack);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    }
    
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Email already exists'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error during registration'
    });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    console.log('=== LOGIN REQUEST ===');
    console.log('Body:', req.body);
    
    // Check if body exists
    if (!req.body || !req.body.email || !req.body.password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    const { email, password, rememberMe } = req.body;

    // Check if user exists
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Generate token
    const token = jwt.sign({ 
      id: user._id,
      email: user.email,
      role: user.role,
      name: user.name
    }, process.env.JWT_SECRET || 'your-secret-key-change-this', {
      expiresIn: rememberMe ? '30d' : '1d'
    });

    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    console.log('✅ User logged in:', user.email);
    
    res.json({
      success: true,
      message: 'Login successful!',
      token,
      user: userResponse
    });

  } catch (error) {
    console.error('❌ Login error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
});

// Change password
router.put('/change-password', protect, async (req, res) => {
  try {
    console.log('=== CHANGE PASSWORD REQUEST ===');
    console.log('User:', req.user._id);
    console.log('Body:', req.body);
    
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Current password and new password are required'
      });
    }
    
    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters'
      });
    }
    
    // Get user with password
    const user = await User.findById(req.user._id).select('+password');
    
    // Verify current password
    const isPasswordValid = await user.comparePassword(currentPassword);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }
    
    // Update password
    user.password = newPassword;
    await user.save();
    
    console.log('✅ Password changed for:', user.email);
    
    res.json({
      success: true,
      message: 'Password changed successfully'
    });
    
  } catch (error) {
    console.error('❌ Password change error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error during password change'
    });
  }
});

// Update user profile
router.put('/profile', protect, async (req, res) => {
  try {
    console.log('=== PROFILE UPDATE REQUEST ===');
    console.log('User:', req.user._id);
    console.log('Body:', req.body);
    
    const { name, phone } = req.body;
    
    if (!name || !phone) {
      return res.status(400).json({
        success: false,
        message: 'Name and phone are required'
      });
    }
    
    // Phone validation
    const phoneRegex = /^07\d{8}$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid phone number. Use format: 07XXXXXXXX'
      });
    }
    
    // Find and update user
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { 
        name, 
        phone, 
        updatedAt: Date.now() 
      },
      { 
        new: true, // Return updated document
        runValidators: true // Run schema validators
      }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    console.log('✅ Profile updated for:', user.email);
    
    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: user
    });

  } catch (error) {
    console.error('❌ Profile update error:', error.message);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error during profile update'
    });
  }
});

// Get current user profile
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    
    res.json({
      success: true,
      user: user
    });
    
  } catch (error) {
    console.error('❌ Get profile error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error fetching profile'
    });
  }
});

// Test token endpoint
router.get('/profile-test', protect, (req, res) => {
  res.json({
    success: true,
    message: 'Token is valid!',
    user: req.user
  });
});

// Admin login (separate from regular login)
router.post('/admin/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }
    
    // Check if user exists
    const user = await User.findOne({ 
      email: email.toLowerCase(),
      role: 'admin'
    }).select('+password');
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid admin credentials'
      });
    }
    
    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid admin credentials'
      });
    }
    
    // Generate admin token
    const token = jwt.sign({ 
      id: user._id,
      email: user.email,
      role: user.role,
      name: user.name,
      isAdmin: true
    }, process.env.JWT_SECRET || 'your-secret-key-change-this', {
      expiresIn: '8h' // Admin tokens expire faster
    });
    
    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;
    
    console.log('✅ Admin logged in:', user.email);
    
    res.json({
      success: true,
      message: 'Admin login successful!',
      token,
      user: userResponse,
      isAdmin: true
    });
    
  } catch (error) {
    console.error('❌ Admin login error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error during admin login'
    });
  }
});

// Add after the admin login route
router.get('/verify-admin', protect, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Admin access required'
      });
    }
    
    res.json({
      success: true,
      message: 'Admin access verified',
      user: req.user
    });
    
  } catch (error) {
    console.error('Admin verification error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error during admin verification'
    });
  }
});

// Simple test endpoints
router.get('/test', (req, res) => {
  res.json({
    success: true,
    message: 'Auth routes are working!',
    timestamp: new Date().toISOString(),
    endpoints: [
      'POST /register',
      'POST /login',
      'PUT /profile',
      'PUT /change-password',
      'GET /me',
      'POST /admin/login'
    ]
  });
});

router.post('/test-post', (req, res) => {
  console.log('Test POST body:', req.body);
  res.json({
    success: true,
    message: 'POST request received',
    body: req.body,
    headers: req.headers
  });
});

module.exports = router;