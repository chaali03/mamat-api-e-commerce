const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { validateLogin, validateSignup } = require('../validators/auth');
const validateRequest = require('../middleware/validateRequest');

// Login route
router.post('/login', validateLogin, validateRequest, authController.login);

// Register route
router.post('/register', validateSignup, validateRequest, authController.signup);

// Forgot password
router.post('/forgot-password', authController.forgotPassword);

// Reset password
router.patch('/reset-password/:token', authController.resetPassword);

// Logout route
router.get('/logout', authController.logout);

module.exports = router;