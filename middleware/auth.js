const jwt = require('jsonwebtoken');
const User = require('../models/User');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.authenticate = catchAsync(async (req, res, next) => {
  // 1) Get tokens
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return next(new AppError('Anda tidak login. Silakan login untuk mendapatkan akses.', 401));
  }

  // 2)  Token verification
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  // 3) Check if the user still exists
  const user = await User.findById(decoded.id);
  if (!user) {
    return next(new AppError('User yang memiliki token ini tidak ada lagi.', 401));
  }

  // 4) Check if the user changed the password after the token was issued
  if (user.changedPasswordAfter(decoded.iat)) {
    return next(new AppError('User baru saja mengubah password! Silakan login kembali.', 401));
  }

  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = user;
  next();
});

exports.authorizeAdmin = (req, res, next) => {
  if (!req.user.role || req.user.role !== 'admin') {
    return next(new AppError('Anda tidak memiliki izin untuk melakukan tindakan ini', 403));
  }
  next();
};

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError('Anda tidak memiliki izin untuk melakukan tindakan ini', 403));
    }
    next();
  };
};