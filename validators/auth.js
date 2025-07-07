import { body } from 'express-validator';
import { AppError } from '../utils/AppError.js';
import User from '../models/User.js';

export const validateSignup = [
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
    // Ganti regex yang kompleks dengan yang lebih sederhana
    // .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
    // .withMessage('Password must contain at least one uppercase, one lowercase, one number and one special character'),
    // Regex baru yang lebih sederhana - hanya memerlukan minimal 8 karakter
    .matches(/^.{8,}$/)
    .withMessage('Password must be at least 8 characters long'),

  body('passwordConfirm')
    .trim()
    .notEmpty()
    .withMessage('Please confirm your password')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new AppError('Passwords do not match', 400);
      }
      return true;
    }),

  body('nickname')
    .trim()
    .notEmpty()
    .withMessage('Nickname is required')
    .isLength({ min: 4 })
    .withMessage('Nickname must be at least 4 characters')
    // Change this line to be more flexible:
    .matches(/^[A-Za-z0-9_]+$/)
    .withMessage('Nickname can only contain letters, numbers, and underscores')
    .custom(async nickname => {
      const user = await User.findOne({ nickname });
      if (user) {
        throw new AppError('Nickname already in use', 400);
      }
    }),
];

export const validateLogin = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email or nickname is required')
    .custom((value) => {
      if (value.includes('@')) {
        // Email format
        if (!/^\S+@\S+\.\S+$/.test(value)) {
          throw new AppError('Invalid email address', 400);
        }
      } else {
        // Nickname format - make it more flexible
        if (value.length < 4) {
          throw new AppError('Nickname must be at least 4 characters', 400);
        }
        // Allow letters, numbers, and underscores
        if (!/^[A-Za-z0-9_]+$/.test(value)) {
          throw new AppError('Nickname can only contain letters, numbers, and underscores', 400);
        }
      }
      return true;
    }),
  body('password')
    .trim()
    .notEmpty()
    .withMessage('Password is required')
];

export const validateForgotPassword = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid email address')
    .normalizeEmail()
];

export const validateOTPVerification = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid email address')
    .normalizeEmail(),

  body('otp')
    .trim()
    .notEmpty()
    .withMessage('OTP is required')
    .isLength({ min: 6, max: 6 })
    .withMessage('OTP must be exactly 6 digits')
    .isNumeric()
    .withMessage('OTP must contain only numbers')
];

export const validateResetPassword = [
  body('resetToken')
    .trim()
    .notEmpty()
    .withMessage('Reset token is required'),

  body('password')
    .trim()
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters')
    .matches(/^.{8,}$/)
    .withMessage('Password must be at least 8 characters long'),

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
