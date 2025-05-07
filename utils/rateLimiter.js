const rateLimit = require('express-rate-limit');
const AppError = require('./appError');

const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  handler: (req, res) => {
    throw new AppError('Too many requests from this IP, please try again later.', 429);
  }
});

module.exports = {
  rateLimiter
};