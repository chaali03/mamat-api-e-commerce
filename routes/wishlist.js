const express = require('express');
const router = express.Router();
const wishlistController = require('../controllers/wishlistController');
const { protect } = require('../controllers/authController');

// Semua rute wishlist memerlukan autentikasi
router.use(protect);

/**
 * @swagger
 * /wishlist:
 *   get:
 *     summary: Mendapatkan wishlist pengguna
 *     tags: [Wishlist]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Berhasil mendapatkan wishlist
 */
router.get('/', wishlistController.getWishlist);

/**
 * @swagger
 * /wishlist/items:
 *   post:
 *     summary: Menambahkan produk ke wishlist
 *     tags: [Wishlist]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *             properties:
 *               productId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Produk berhasil ditambahkan ke wishlist
 */
router.post('/items', wishlistController.addToWishlist);

/**
 * @swagger
 * /wishlist/items/{productId}:
 *   delete:
 *     summary: Menghapus produk dari wishlist
 *     tags: [Wishlist]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Produk berhasil dihapus dari wishlist
 */
router.delete('/items/:productId', wishlistController.removeFromWishlist);

/**
 * @swagger
 * /wishlist/items/{productId}/move-to-cart:
 *   post:
 *     summary: Memindahkan produk dari wishlist ke keranjang
 *     tags: [Wishlist]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               quantity:
 *                 type: number
 *                 default: 1
 *     responses:
 *       200:
 *         description: Produk berhasil dipindahkan ke keranjang
 */
router.post('/items/:productId/move-to-cart', wishlistController.moveToCart);

module.exports = router;