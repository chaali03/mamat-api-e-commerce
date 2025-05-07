const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { authenticate } = require('../middleware/auth');
const catchAsync = require('../utils/catchAsync');

// Mendapatkan semua pesanan user
router.get('/', authenticate, catchAsync(orderController.getUserOrders));

// Mendapatkan detail pesanan
router.get('/:orderId', authenticate, catchAsync(orderController.getOrderDetails));

// Membatalkan pesanan
router.put('/:orderId/cancel', authenticate, catchAsync(orderController.cancelOrder));

// Konfirmasi penerimaan pesanan
router.put('/:orderId/confirm-receipt', authenticate, catchAsync(orderController.confirmReceipt));

// Melacak pengiriman pesanan
router.get('/:orderId/tracking', authenticate, catchAsync(orderController.trackOrder));

module.exports = router;