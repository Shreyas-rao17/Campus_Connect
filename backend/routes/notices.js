// routes/notices.js

const express = require('express');
const router = express.Router();
const Notice = require('../models/Notice');
const emailService = require('../utils/email');

// @route    GET /api/notices
// @desc     Get all notices
router.get('/', async (req, res) => {
  try {
    const notices = await Notice.find().sort({ date: -1 });
    res.json(notices);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @route    POST /api/notices
// @desc     Create a new notice
router.post('/', async (req, res) => {
  const { title, body, postedBy } = req.body;

  try {
    const newNotice = new Notice({
      title,
      body,
      postedBy
    });    const savedNotice = await newNotice.save();
    
    // Send email notification
    try {
      await emailService.sendNoticeEmail(savedNotice);
    } catch (emailError) {
      console.warn('📧 Email notification failed:', emailError.message);
      // Don't fail the request if email fails, just log it
    }
    
    res.status(201).json(savedNotice);
  } catch (err) {
    console.error('❌ Error saving notice:', err);
    res.status(500).json({ 
      message: 'Error saving notice',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined 
    });
  }
});

module.exports = router;
