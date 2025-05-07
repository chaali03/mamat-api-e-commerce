const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const { authenticate } = require('../middleware/auth');

// Mendapatkan semua notifikasi user
router.get('/', authenticate, notificationController.getUserNotifications);

// Menandai notifikasi sebagai dibaca
router.put('/:notificationId/read', authenticate, notificationController.markAsRead);

// Menandai semua notifikasi sebagai dibaca
router.put('/read-all', authenticate, notificationController.markAllAsRead);

module.exports = router;