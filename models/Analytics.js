const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema({
  event: {
    type: String,
    required: [true, 'Event name is required'],
    trim: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  ip: String,
  userAgent: String,
  path: String,
  referrer: String
}, {
  timestamps: true
});

// Indexes for better query performance
analyticsSchema.index({ event: 1, timestamp: -1 });
analyticsSchema.index({ user: 1 });

// Populate user when finding analytics
analyticsSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'user',
    select: 'name email'
  });
  next();
});

const Analytics = mongoose.model('Analytics', analyticsSchema);

module.exports = Analytics;