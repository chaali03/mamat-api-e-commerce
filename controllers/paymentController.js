const Payment = require('../models/Payment');
const Order = require('../models/Order');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

/**
 * Get available payment methods
 */
exports.getPaymentMethods = catchAsync(async (req, res, next) => {
  const paymentMethods = [
    {
      id: 'credit_card',
      name: 'Credit Card',
      description: 'Pay with Visa, Mastercard, or American Express',
      icon: 'credit-card.png'
    },
    {
      id: 'bank_transfer',
      name: 'Bank Transfer',
      description: 'Pay via bank transfer',
      icon: 'bank-transfer.png'
    },
    {
      id: 'e_wallet',
      name: 'E-Wallet',
      description: 'Pay with your e-wallet',
      icon: 'e-wallet.png'
    }
  ];

  res.status(200).json({
    status: 'success',
    data: {
      paymentMethods
    }
  });
});

/**
 * Create a new payment
 */
exports.createPayment = catchAsync(async (req, res, next) => {
  const { orderId, paymentMethod, amount, paymentDetails } = req.body;

  // Validate order exists
  const order = await Order.findById(orderId);
  if (!order) {
    return next(new AppError('Order not found', 404));
  }

  // Validate payment amount matches order total
  if (amount !== order.totalPrice) {
    return next(new AppError('Payment amount does not match order total', 400));
  }

  // Create payment record
  const payment = await Payment.create({
    order: orderId,
    user: req.user.id,
    amount,
    paymentMethod,
    status: 'pending',
    transactionId: `TRX-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    paymentDetails
  });

  res.status(201).json({
    status: 'success',
    data: {
      payment
    }
  });
});

/**
 * Verify a payment
 */
exports.verifyPayment = catchAsync(async (req, res, next) => {
  const { paymentId, verificationData } = req.body;

  // Find payment
  const payment = await Payment.findById(paymentId);
  if (!payment) {
    return next(new AppError('Payment not found', 404));
  }

  // Verify payment belongs to user
  if (payment.user.toString() !== req.user.id) {
    return next(new AppError('You are not authorized to verify this payment', 403));
  }

  // Update payment status (in a real app, you would verify with payment gateway)
  payment.status = 'completed';
  await payment.save();

  // Update order payment status
  await Order.findByIdAndUpdate(payment.order, {
    isPaid: true,
    paidAt: Date.now(),
    paymentResult: {
      id: payment.transactionId,
      status: 'completed',
      updateTime: new Date().toISOString(),
      email: req.user.email
    }
  });

  res.status(200).json({
    status: 'success',
    data: {
      payment
    }
  });
});

/**
 * Get payment status
 */
exports.getPaymentStatus = catchAsync(async (req, res, next) => {
  const { paymentId } = req.params;

  const payment = await Payment.findById(paymentId);
  if (!payment) {
    return next(new AppError('Payment not found', 404));
  }

  // Verify payment belongs to user
  if (payment.user.toString() !== req.user.id) {
    return next(new AppError('You are not authorized to view this payment', 403));
  }

  res.status(200).json({
    status: 'success',
    data: {
      payment
    }
  });
});