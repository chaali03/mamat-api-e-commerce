const jwt = require('jsonwebtoken');
const AppError = require('./appError');

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

// Verify JWT token
const verifyToken = async (token) => {
  try {
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (error) {
    throw new AppError('Invalid token or token expired', 401);
  }
};

module.exports = {
  generateToken,
  verifyToken
};