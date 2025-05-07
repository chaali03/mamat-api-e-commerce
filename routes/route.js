const express = require('express');
const router = express.Router();

// Define your routes here
router.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Route API is working'
  });
});

module.exports = router;