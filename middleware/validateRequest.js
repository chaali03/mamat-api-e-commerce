const { validationResult } = require('express-validator');
const AppError = require('../utils/appError');

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const message = errors.array().map(err => `${err.msg}`).join(' ');
    return next(new AppError(`Validation error: ${message}`, 400));
  }
  next();
};

module.exports = validateRequest;