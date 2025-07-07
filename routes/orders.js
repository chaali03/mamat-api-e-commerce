import express from 'express';
import * as orderController from '../controllers/orderController.js';
import authenticate from '../middleware/auth.js';
import { catchAsync } from '../utils/catchAsync.js';

const router = express.Router();

// Get all orders for user
router.get('/', authenticate, catchAsync(orderController.getUserOrders));

// Get order details
router.get('/:orderId', authenticate, catchAsync(orderController.getOrderDetails));

// Create new order
router.post('/', authenticate, catchAsync(orderController.createOrder));

// Update order status
router.patch('/:orderId/status', authenticate, catchAsync(orderController.updateOrderStatus));

// Cancel order
router.patch('/:orderId/cancel', authenticate, catchAsync(orderController.cancelOrder));

// Konfirmasi penerimaan pesanan
router.put('/:orderId/confirm-receipt', authenticate, catchAsync(orderController.confirmReceipt));

// Melacak pengiriman pesanan
router.get('/:orderId/tracking', authenticate, catchAsync(orderController.trackOrder));

export default router;