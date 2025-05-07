const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const { protect } = require('../controllers/authController');

// Semua rute keranjang belanja memerlukan autentikasi
router.use(protect);

/**
 * @swagger
 * /cart:
 *   get:
 *     summary: Mendapatkan keranjang belanja pengguna
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Berhasil mendapatkan keranjang belanja
 */
router.get('/', cartController.getCart);

/**
 * @swagger
 * /cart/items:
 *   post:
 *     summary: Menambahkan item ke keranjang
 *     tags: [Cart]
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
 *               quantity:
 *                 type: number
 *                 default: 1
 *     responses:
 *       200:
 *         description: Item berhasil ditambahkan ke keranjang
 */
router.post('/items', cartController.addItem);

/**
 * @swagger
 * /cart/items/{itemId}:
 *   patch:
 *     summary: Mengupdate jumlah item di keranjang
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - quantity
 *             properties:
 *               quantity:
 *                 type: number
 *                 minimum: 1
 *     responses:
 *       200:
 *         description: Item berhasil diupdate
 */
router.patch('/items/:itemId', cartController.updateItem);

/**
 * @swagger
 * /cart/items/{itemId}:
 *   delete:
 *     summary: Menghapus item dari keranjang
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Item berhasil dihapus dari keranjang
 */
router.delete('/items/:itemId', cartController.removeItem);

/**
 * @swagger
 * /cart:
 *   delete:
 *     summary: Mengosongkan keranjang
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Keranjang berhasil dikosongkan
 */
router.delete('/', cartController.clearCart);

module.exports = router;