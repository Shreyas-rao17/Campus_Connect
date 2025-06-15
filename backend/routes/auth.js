const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('../models/admin');
const authMiddleware = require('../middleware/auth');

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    const admin = await Admin.findOne({ email }).select('+password');
    if (!admin) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Create token
    const token = jwt.sign(
      { id: admin._id, email: admin.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Remove password from response
    const user = admin.toObject();
    delete user.password;

    res.json({
      token,
      user,
      message: 'Login successful'
    });
  } catch (err) {
    console.error('❌ Login error:', err);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// GET /api/auth/me - Get current user
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin.id).select('-password');
    if (!admin) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(admin);
  } catch (err) {
    console.error('❌ Error fetching user:', err);
    res.status(500).json({ message: 'Server error while fetching user data' });
  }
});

// POST /api/auth/signup
router.post('/signup', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    // Check if user already exists
    let admin = await Admin.findOne({ $or: [{ email }, { username }] });
    if (admin) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new admin
    const hashedPassword = await bcrypt.hash(password, 10);
    admin = new Admin({
      username,
      email,
      password: hashedPassword
    });

    await admin.save();

    // Create token
    const token = jwt.sign(
      { id: admin._id, email: admin.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Remove password from response
    const user = admin.toObject();
    delete user.password;

    res.status(201).json({
      token,
      user,
      message: 'Account created successfully'
    });
  } catch (err) {
    console.error('❌ Signup error:', err);
    res.status(500).json({ message: 'Server error during signup' });
  }
});

module.exports = router;
