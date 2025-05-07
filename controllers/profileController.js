const User = require('../models/User');
const Order = require('../models/Order');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

/**
 * Get user profile
 */
exports.getProfile = catchAsync(async (req, res, next) => {
  // User is already available in req.user from the authenticate middleware
  const user = await User.findById(req.user.id).select('-password');

  res.status(200).json({
    status: 'success',
    data: {
      user
    }
  });
});

/**
 * Update user profile
 */
exports.updateProfile = catchAsync(async (req, res, next) => {
  // Filter out fields that shouldn't be updated
  const filteredBody = {};
  const allowedFields = ['name', 'email', 'phone', 'photo'];
  
  Object.keys(req.body).forEach(key => {
    if (allowedFields.includes(key)) {
      filteredBody[key] = req.body[key];
    }
  });

  // Update user
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    filteredBody,
    {
      new: true,
      runValidators: true
    }
  ).select('-password');

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser
    }
  });
});

/**
 * Change user password
 */
exports.changePassword = catchAsync(async (req, res, next) => {
  const { currentPassword, newPassword, passwordConfirm } = req.body;

  // Check if all required fields are provided
  if (!currentPassword || !newPassword || !passwordConfirm) {
    return next(new AppError('Please provide current password, new password and password confirmation', 400));
  }

  // Check if new password and confirmation match
  if (newPassword !== passwordConfirm) {
    return next(new AppError('New password and password confirmation do not match', 400));
  }

  // Get user with password
  const user = await User.findById(req.user.id).select('+password');

  // Check if current password is correct
  if (!(await user.correctPassword(currentPassword, user.password))) {
    return next(new AppError('Current password is incorrect', 401));
  }

  // Update password
  user.password = newPassword;
  user.passwordConfirm = passwordConfirm;
  await user.save();

  res.status(200).json({
    status: 'success',
    message: 'Password updated successfully'
  });
});

/**
 * Get user order history
 */
exports.getOrderHistory = catchAsync(async (req, res, next) => {
  const orders = await Order.find({ user: req.user.id })
    .sort('-createdAt');

  res.status(200).json({
    status: 'success',
    results: orders.length,
    data: {
      orders
    }
  });
});