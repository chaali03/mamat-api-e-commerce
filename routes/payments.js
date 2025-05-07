const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { authenticate } = require('../middleware/auth');

// Mendapatkan metode pembayaran yang tersedia
router.get('/methods', paymentController.getPaymentMethods);

// Membuat pembayaran baru
router.post('/create', authenticate, paymentController.createPayment);

// Verifikasi pembayaran
router.post('/verify', authenticate, paymentController.verifyPayment);

// Mendapatkan status pembayaran
router.get('/:paymentId/status', authenticate, paymentController.getPaymentStatus);

module.exports = router;