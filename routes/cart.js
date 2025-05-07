const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const { authenticate } = require('../middleware/auth');

// Mendapatkan keranjang user
router.get('/', authenticate, cartController.getCart);

// Menambahkan produk ke keranjang
router.post('/add', authenticate, cartController.addToCart);

// Mengubah jumlah produk di keranjang
router.put('/update/:itemId', authenticate, cartController.updateCartItem);

// Menghapus produk dari keranjang
router.delete('/remove/:itemId', authenticate, cartController.removeFromCart);

// Mengosongkan keranjang
router.delete('/clear', authenticate, cartController.clearCart);

// Checkout keranjang
router.post('/checkout', authenticate, cartController.checkout);

module.exports = router;