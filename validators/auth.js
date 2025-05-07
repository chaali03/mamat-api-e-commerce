const { body } = require('express-validator');
const AppError = require('../utils/appError');
const User = require('../models/User');

exports.validateSignup = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ max: 50 })
    .withMessage('Name must be less than 50 characters'),
  
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid email address')
    .custom(async email => {
      const user = await User.findOne({ email });
      if (user) {
        throw new AppError('Email already in use', 400);
      }
    })
    .normalizeEmail(),

  body('password')
    .trim()
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
    .withMessage('Password must contain at least one uppercase, one lowercase, one number and one special character'),

  body('passwordConfirm')
    .trim()
    .notEmpty()
    .withMessage('Please confirm your password')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new AppError('Passwords do not match', 400);
      }
      return true;
    })
];

exports.validateLogin = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid email address'),

  body('password')
    .trim()
    .notEmpty()
    .withMessage('Password is required')
];