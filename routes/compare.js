const express = require('express');
const router = express.Router();
const compareController = require('../controllers/compareController');
const { protect } = require('../controllers/authController');

/**
 * @swagger
 * /compare/products:
 *   post:
 *     summary: Membandingkan produk berdasarkan ID (untuk pengguna yang tidak login)
 *     tags: [Compare]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productIds
 *             properties:
 *               productIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                 minItems: 2
 *                 maxItems: 4
 *     responses:
 *       200:
 *         description: Berhasil membandingkan produk
 */
router.post('/products', compareController.compareProducts);

// Rute yang memerlukan autentikasi
router.use(protect);

/**
 * @swagger
 * /compare:
 *   get:
 *     summary: Mendapatkan daftar perbandingan produk pengguna
 *     tags: [Compare]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Berhasil mendapatkan daftar perbandingan
 */
router.get('/', compareController.getCompareList);

/**
 * @swagger
 * /compare:
 *   post:
 *     summary: Menambahkan produk ke daftar perbandingan
 *     tags: [Compare]
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
 *         description: Produk berhasil ditambahkan ke daftar perbandingan
 */
router.post('/', compareController.addToCompare);

/**
 * @swagger
 * /compare/{productId}:
 *   delete:
 *     summary: Menghapus produk dari daftar perbandingan
 *     tags: [Compare]
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
 *         description: Produk berhasil dihapus dari daftar perbandingan
 */
router.delete('/:productId', compareController.removeFromCompare);

/**
 * @swagger
 * /compare:
 *   delete:
 *     summary: Mengosongkan daftar perbandingan
 *     tags: [Compare]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Daftar perbandingan berhasil dikosongkan
 */
router.delete('/', compareController.clearCompare);

module.exports = router;