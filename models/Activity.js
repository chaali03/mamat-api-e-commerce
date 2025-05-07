const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required']
  },
  type: {
    type: String,
    required: [true, 'Activity type is required'],
    enum: ['login', 'logout', 'register', 'order', 'review', 'payment', 'profile_update']
  },
  description: {
    type: String,
    required: [true, 'Activity description is required']
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  ip: String,
  userAgent: String
}, {
  timestamps: true
});

// Indexes for better query performance
activitySchema.index({ user: 1, createdAt: -1 });
activitySchema.index({ type: 1 });

// Populate user when finding activities
activitySchema.pre(/^find/, function(next) {
  this.populate({
    path: 'user',
    select: 'name email'
  });
  next();
});

const Activity = mongoose.model('Activity', activitySchema);

module.exports = Activity;