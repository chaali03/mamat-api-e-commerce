import express from 'express';
import * as authController from '../controllers/authController.js';
import { validateLogin, validateSignup } from '../validators/auth.js';
import validateRequest from '../middleware/validateRequest.js';

const router = express.Router();

// Login route
router.post('/login', validateLogin, validateRequest, authController.login);

// Register route
router.post('/register', validateSignup, validateRequest, authController.signup);

// Forgot password
// Send OTP (alias for forgot password)
router.post('/send-otp', authController.forgotPassword);

// Verify OTP
router.post('/verify-otp', authController.verifyOTP);

// Reset password
router.patch('/reset-password/:token', authController.resetPassword);

// Google login route
router.post('/google', authController.loginWithGoogle);

// Facebook login route
router.post('/facebook', authController.loginWithFacebook);

// Logout route
router.get('/logout', authController.logout);

export default router;