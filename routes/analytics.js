const express = require('express');
const router = express.Router();
const { protect, restrictTo } = require('../middleware/auth');
const Analytics = require('../models/Analytics');

// Get analytics data (protected, admin only)
router.get('/', protect, restrictTo('admin'), async (req, res) => {
  try {
    const analytics = await Analytics.find()
      .sort('-timestamp')
      .limit(parseInt(req.query.limit) || 100);
    
    res.status(200).json({
      success: true,
      count: analytics.length,
      data: analytics
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
});

// Create analytics entry
router.post('/', protect, async (req, res) => {
  try {
    const analytics = await Analytics.create({
      ...req.body,
      user: req.user._id,
      ip: req.ip,
      userAgent: req.headers['user-agent'],
      path: req.originalUrl,
      referrer: req.headers.referer || ''
    });

    res.status(201).json({
      success: true,
      data: analytics
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;