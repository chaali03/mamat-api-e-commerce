const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required']
  },
  title: {
    type: String,
    required: [true, 'Notification title is required']
  },
  message: {
    type: String,
    required: [true, 'Notification message is required']
  },
  type: {
    type: String,
    enum: ['info', 'success', 'warning', 'error'],
    default: 'info'
  },
  read: {
    type: Boolean,
    default: false
  },
  data: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true
});

// Index for better query performance
notificationSchema.index({ user: 1, createdAt: -1 });
notificationSchema.index({ read: 1 });

// Populate user when finding notifications
notificationSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'user',
    select: 'name email'
  });
  next();
});

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;