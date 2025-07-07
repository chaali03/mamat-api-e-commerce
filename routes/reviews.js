import express from 'express';
import { protect, restrictTo } from '../controllers/authController.js';
import * as reviewController from '../controllers/reviewController.js';

const router = express.Router({ mergeParams: true });

/**
 * @swagger
 * /products/{productId}/reviews:
 *   get:
 *     summary: Mendapatkan semua review untuk produk tertentu
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Berhasil mendapatkan daftar review
 */
router.get('/products/:productId/reviews', reviewController.getProductReviews);

/**
 * @swagger
 * /products/{productId}/reviews/stats:
 *   get:
 *     summary: Mendapatkan statistik rating untuk produk tertentu
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Berhasil mendapatkan statistik rating
 */
router.get('/products/:productId/reviews/stats', reviewController.getProductRatingStats);

// Rute yang memerlukan autentikasi
router.use(protect);

/**
 * @swagger
 * /reviews/my-reviews:
 *   get:
 *     summary: Mendapatkan semua review yang dibuat oleh pengguna yang login
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Berhasil mendapatkan daftar review pengguna
 */
router.get('/my-reviews', reviewController.getMyReviews);

/**
 * @swagger
 * /products/{productId}/reviews:
 *   post:
 *     summary: Membuat review baru untuk produk
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
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
 *               - rating
 *               - review
 *             properties:
 *               rating:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 5
 *               title:
 *                 type: string
 *               review:
 *                 type: string
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Review berhasil dibuat
 */
router.post('/products/:productId/reviews', reviewController.createReview);

/**
 * @swagger
 * /reviews/{id}:
 *   get:
 *     summary: Mendapatkan review berdasarkan ID
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Berhasil mendapatkan review
 */
router.get('/:id', reviewController.getReview);

/**
 * @swagger
 * /reviews/{id}:
 *   patch:
 *     summary: Mengupdate review
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rating:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 5
 *               title:
 *                 type: string
 *               review:
 *                 type: string
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Review berhasil diupdate
 */
router.patch('/:id', reviewController.updateReview);

/**
 * @swagger
 * /reviews/{id}:
 *   delete:
 *     summary: Menghapus review
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Review berhasil dihapus
 */
router.delete('/:id', reviewController.deleteReview);

/**
 * @swagger
 * /reviews/{id}/like:
 *   post:
 *     summary: Menyukai review
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Berhasil menyukai review
 */
router.post('/:id/like', reviewController.likeReview);

export default router;