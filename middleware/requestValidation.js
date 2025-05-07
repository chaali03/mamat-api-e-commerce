const { validationResult } = require('express-validator');
const AppError = require('../appError');

/**
 * Middleware for request validation
 * @param {Object} req Request object
 * @param {Object} res Response object
 * @param {Function} next Next function
 */
module.exports = (req, res, next) => {
  // 1. Validasi Content-Type
  const contentType = req.headers['content-type'];
  const allowedMethodsWithoutBody = ['GET', 'DELETE', 'HEAD'];
  
  if (!allowedMethodsWithoutBody.includes(req.method) && 
      !contentType?.includes('application/json')) {
    return next(new AppError(
      'Content-Type header must be application/json',
      400,
      'INVALID_CONTENT_TYPE'
    ));
  }

  // 2. Body validation for POST/PUT/PATCH
  if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
    if (!req.body || Object.keys(req.body).length === 0) {
      return next(new AppError(
        'Request body cannot be empty',
        400,
        'EMPTY_REQUEST_BODY'
      ));
    }
  }

  // 3. Sanitation input
  for (const key in req.body) {
    if (typeof req.body[key] === 'string') {
      req.body[key] = req.body[key].trim();
      
      // Remove HTML tags if not allowed
      if (!['description', 'content'].includes(key)) {
        req.body[key] = req.body[key].replace(/<[^>]*>?/gm, '');
      }
    }
  }

  // 4. Validasi hasil express-validator (jika menggunakan)
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(err => ({
      field: err.param,
      message: err.msg,
      location: err.location
    }));

    return next(new AppError(
      'Validation failed',
      422,
      'VALIDATION_ERROR',
      { errors: errorMessages }
    ));
  }

  // 5. Validation of express-validator results (if using)
  if (req.query.page || req.query.limit) {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;

    if (page < 1 || limit < 1 || limit > 100) {
      return next(new AppError(
        'Invalid pagination parameters. Page must be >= 1 and limit between 1-100',
        400,
        'INVALID_PAGINATION'
      ));
    }

    req.pagination = { page, limit };
  }

  next();
};