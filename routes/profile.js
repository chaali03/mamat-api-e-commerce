import express from 'express';
import { protect } from '../controllers/authController.js';
import {
  getProfile,
  updateProfile,
  changePassword,
  getOrderHistory,
  uploadUserAvatar,
  resizeUserAvatar
} from '../controllers/profileController.js';

const router = express.Router();

// Protect all routes after this middleware
router.use(protect);

router.get('/', getProfile);
router.patch('/', uploadUserAvatar, resizeUserAvatar, updateProfile);
router.patch('/change-password', changePassword);
router.get('/orders', getOrderHistory);

export default router;