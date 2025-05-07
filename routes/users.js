const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const { authenticate } = require('../middleware/auth');

// Mendapatkan profil user
router.get('/profile', authenticate, profileController.getProfile);

// Mengupdate profil user
router.put('/profile', authenticate, profileController.updateProfile);

// Mengubah password
router.put('/change-password', authenticate, profileController.changePassword);

// Mendapatkan riwayat pesanan
router.get('/order-history', authenticate, profileController.getOrderHistory);

// Mendapatkan riwayat transaksi - Comment this out for now as it doesn't exist in profileController
// router.get('/transaction-history', authenticate, userController.getTransactionHistory);

module.exports = router;