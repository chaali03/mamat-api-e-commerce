const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { authenticate } = require('../middleware/auth');

// Mendapatkan semua review untuk produk
router.get('/product/:productId', reviewController.getProductReviews);

// Menambahkan review untuk produk
router.post('/product/:productId', authenticate, reviewController.addReview);

// Mengupdate review
router.put('/:reviewId', authenticate, reviewController.updateReview);

// Menghapus review
router.delete('/:reviewId', authenticate, reviewController.deleteReview);

module.exports = router;