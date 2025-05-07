const Notification = require('../models/Notification');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

/**
 * Get all notifications for the logged-in user
 */
exports.getUserNotifications = catchAsync(async (req, res, next) => {
  const notifications = await Notification.find({ 
    user: req.user.id 
  }).sort('-createdAt');

  res.status(200).json({
    status: 'success',
    results: notifications.length,
    data: {
      notifications
    }
  });
});

/**
 * Mark a specific notification as read
 */
exports.markAsRead = catchAsync(async (req, res, next) => {
  const notification = await Notification.findOneAndUpdate(
    { 
      _id: req.params.notificationId,
      user: req.user.id
    },
    { 
      isRead: true,
      readAt: Date.now() 
    },
    { 
      new: true 
    }
  );

  if (!notification) {
    return next(new AppError('Notifikasi tidak ditemukan', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      notification
    }
  });
});

/**
 * Mark all notifications as read for the logged-in user
 */
exports.markAllAsRead = catchAsync(async (req, res, next) => {
  await Notification.updateMany(
    { 
      user: req.user.id,
      isRead: false
    },
    { 
      isRead: true,
      readAt: Date.now() 
    }
  );

  res.status(200).json({
    status: 'success',
    message: 'Semua notifikasi telah ditandai sebagai dibaca'
  });
});