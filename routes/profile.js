const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const { authenticate } = require('../middleware/auth');

// Mendapatkan profil customer
router.get('/', authenticate, profileController.getProfile);

// Mengupdate profil customer
router.put('/', authenticate, profileController.updateProfile);

// Mengubah password
router.put('/change-password', authenticate, profileController.changePassword);

// Mendapatkan riwayat pesanan
router.get('/orders', authenticate, profileController.getOrderHistory);

module.exports = router;