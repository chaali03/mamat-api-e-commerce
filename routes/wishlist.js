const express = require('express');
const router = express.Router();
const wishlistController = require('../controllers/wishlistController');
const { authenticate } = require('../middleware/auth');

// Mendapatkan wishlist user
router.get('/', authenticate, wishlistController.getWishlist);

// Menambahkan produk ke wishlist
router.post('/add/:productId', authenticate, wishlistController.addToWishlist);

// Menghapus produk dari wishlist
router.delete('/remove/:productId', authenticate, wishlistController.removeFromWishlist);

// Memindahkan produk dari wishlist ke keranjang
router.post('/move-to-cart/:productId', authenticate, wishlistController.moveToCart);

module.exports = router;