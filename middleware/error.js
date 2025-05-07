const AppError = require('../utils/appError');
const logger = require('../utils/logger');

// Handle MongoDB Cast Error (invalid ID format)
const handleCastErrorDB = err => {
  const message = `Data tidak valid pada field ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

// Handle MongoDB Duplicate Fields
const handleDuplicateFieldsDB = err => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  const message = `Data duplikat: ${value}. Silakan gunakan nilai lain!`;
  return new AppError(message, 400);
};

// Handle Mongoose Validation Error
const handleValidationErrorDB = err => {
  const errors = Object.values(err.errors).map(el => el.message);
  const message = `Data tidak valid: ${errors.join('. ')}`;
  return new AppError(message, 400);
};

// Handle JWT Authentication Errors
const handleJWTError = () => 
  new AppError('Token tidak valid. Silakan login kembali!', 401);

const handleJWTExpiredError = () => 
  new AppError('Token sudah kadaluarsa. Silakan login kembali!', 401);

// Handle Multer File Upload Errors
const handleMulterError = err => {
  if (err.code === 'LIMIT_FILE_SIZE') {
    return new AppError('Ukuran file terlalu besar. Maksimal 5MB', 400);
  }
  if (err.code === 'LIMIT_FILE_COUNT') {
    return new AppError('Jumlah file melebihi batas maksimal', 400);
  }
  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    return new AppError('Tipe file tidak didukung', 400);
  }
  return new AppError('Error saat upload file', 400);
};

// Development Error Response
const sendErrorDev = (err, req, res) => {
  // API Errors
  if (req.originalUrl.startsWith('/api')) {
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack
    });
  }

  // Rendered Website Errors
  logger.error('ERROR 💥:', err);
  return res.status(err.statusCode).json({
    title: 'Terjadi kesalahan!',
    msg: err.message
  });
};

// Production Error Response
const sendErrorProd = (err, req, res) => {
  // A) API Errors
  if (req.originalUrl.startsWith('/api')) {
    // Operational, trusted error: send message to client
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message
      });
    }
    // Programming or other unknown error: don't leak error details
    logger.error('ERROR 💥:', err);
    return res.status(500).json({
      status: 'error',
      message: 'Terjadi kesalahan pada server!'
    });
  }

  // B) Rendered Website Errors
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      title: 'Terjadi kesalahan!',
      msg: err.message
    });
  }
  
  logger.error('ERROR 💥:', err);
  return res.status(err.statusCode).json({
    title: 'Terjadi kesalahan!',
    msg: 'Silakan coba beberapa saat lagi.'
  });
};

// Main Error Handling Middleware
module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
  } else {
    let error = { ...err };
    error.message = err.message;
    error.name = err.name;

    // Handle specific errors
    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === 'ValidationError') error = handleValidationErrorDB(error);
    if (error.name === 'JsonWebTokenError') error = handleJWTError();
    if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();
    if (error.name === 'MulterError') error = handleMulterError(error);

    sendErrorProd(error, req, res);
  }
};