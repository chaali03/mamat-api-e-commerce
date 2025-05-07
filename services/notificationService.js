const Notification = require('../models/Notification');

class NotificationService {
  constructor(io) {
    this.io = io;
  }
  
  async createNotification(userId, title, message, type, data = {}) {
    try {
      const notification = await Notification.create({
        user: userId,
        title,
        message,
        type,
        data
      });
      
      // Emit notification to user
      this.io.to(userId.toString()).emit('notification', {
        id: notification._id,
        title,
        message,
        type,
        data,
        createdAt: notification.createdAt
      });
      
      return notification;
    } catch (error) {
      console.error('Notification service error:', error);
      throw new Error('Gagal membuat notifikasi');
    }
  }
  
  async getUserNotifications(userId, page = 1, limit = 10) {
    try {
      const skip = (page - 1) * limit;
      
      const notifications = await Notification.find({ user: userId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);
        
      const total = await Notification.countDocuments({ user: userId });
      
      return {
        notifications,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      console.error('Notification service error:', error);
      throw new Error('Gagal mendapatkan notifikasi');
    }
  }
  
  async markAsRead(notificationId, userId) {
    try {
      const notification = await Notification.findOneAndUpdate(
        { _id: notificationId, user: userId },
        { isRead: true },
        { new: true }
      );
      
      return notification;
    } catch (error) {
      console.error('Notification service error:', error);
      throw new Error('Gagal menandai notifikasi sebagai dibaca');
    }
  }
  
  async markAllAsRead(userId) {
    try {
      await Notification.updateMany(
        { user: userId, isRead: false },
        { isRead: true }
      );
      
      return true;
    } catch (error) {
      console.error('Notification service error:', error);
      throw new Error('Gagal menandai semua notifikasi sebagai dibaca');
    }
  }
}

module.exports = NotificationService;