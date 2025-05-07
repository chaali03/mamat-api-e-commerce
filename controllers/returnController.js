const Return = require('../models/Return');
const Order = require('../models/Order');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

/**
 * Create a new return request
 */
exports.createReturn = catchAsync(async (req, res, next) => {
  const { orderId, items, reason } = req.body;

  // Validate order exists and belongs to user
  const order = await Order.findOne({
    _id: orderId,
    user: req.user.id
  });

  if (!order) {
    return next(new AppError('Pesanan tidak ditemukan', 404));
  }

  // Create return request
  const returnRequest = await Return.create({
    order: orderId,
    user: req.user.id,
    items,
    reason,
    status: 'pending'
  });

  res.status(201).json({
    status: 'success',
    data: {
      return: returnRequest
    }
  });
});

/**
 * Get all returns for the logged-in user
 */
exports.getUserReturns = catchAsync(async (req, res, next) => {
  const returns = await Return.find({ 
    user: req.user.id 
  }).sort('-createdAt');

  res.status(200).json({
    status: 'success',
    results: returns.length,
    data: {
      returns
    }
  });
});

/**
 * Get details of a specific return
 */
exports.getReturnDetails = catchAsync(async (req, res, next) => {
  const returnRequest = await Return.findOne({
    _id: req.params.returnId,
    user: req.user.id
  }).populate('order');

  if (!returnRequest) {
    return next(new AppError('Pengembalian tidak ditemukan', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      return: returnRequest
    }
  });
});

/**
 * Cancel a return request
 */
exports.cancelReturn = catchAsync(async (req, res, next) => {
  const returnRequest = await Return.findOneAndUpdate(
    {
      _id: req.params.returnId,
      user: req.user.id,
      status: 'pending' // Only pending returns can be canceled
    },
    { status: 'canceled' },
    { new: true }
  );

  if (!returnRequest) {
    return next(new AppError('Pengembalian tidak ditemukan atau tidak dapat dibatalkan', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      return: returnRequest
    }
  });
});

/**
 * Track return status
 */
exports.trackReturnStatus = catchAsync(async (req, res, next) => {
  const returnRequest = await Return.findOne({
    _id: req.params.returnId,
    user: req.user.id
  });

  if (!returnRequest) {
    return next(new AppError('Pengembalian tidak ditemukan', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      status: returnRequest.status,
      statusHistory: returnRequest.statusHistory || [],
      updatedAt: returnRequest.updatedAt
    }
  });
});