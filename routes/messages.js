import express from 'express';
import authenticate from '../middleware/auth.js';
import Message from '../models/Message.js';
import { AppError } from '../utils/AppError.js';
import { catchAsync } from '../utils/catchAsync.js';

const router = express.Router();

// Get all messages for a user
router.get('/', authenticate, catchAsync(async (req, res) => {
  const messages = await Message.find({
    $or: [
      { sender: req.user.id },
      { receiver: req.user.id }
    ]
  }).sort('-createdAt');

  res.status(200).json({
    status: 'success',
    results: messages.length,
    data: {
      messages
    }
  });
}));

// Send a new message
router.post('/', authenticate, catchAsync(async (req, res) => {
  const { receiver, content, type = 'text' } = req.body;

  if (!receiver || !content) {
    throw new AppError('Please provide receiver and message content', 400);
  }

  const message = await Message.create({
    sender: req.user.id,
    receiver,
    content,
    type
  });

  res.status(201).json({
    status: 'success',
    data: {
      message
    }
  });
}));

// Mark message as read
router.patch('/:id/read', authenticate, catchAsync(async (req, res) => {
  const message = await Message.findOneAndUpdate(
    {
      _id: req.params.id,
      receiver: req.user.id
    },
    {
      readAt: Date.now(),
      status: 'read'
    },
    { new: true }
  );

  if (!message) {
    throw new AppError('No message found with that ID', 404);
  }

  res.status(200).json({
    status: 'success',
    data: {
      message
    }
  });
}));

export default router;