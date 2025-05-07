const express = require('express');
const router = express.Router();
const socialController = require('../controllers/socialController');
const { protect, restrictTo } = require('../controllers/authController');

/**
 * @swagger
 * /social/share:
 *   post:
 *     summary: Membuat URL berbagi untuk produk
 *     tags: [Social]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *               - platform
 *             properties:
 *               productId:
 *                 type: string
 *               platform:
 *                 type: string
 *                 enum: [facebook, twitter, instagram, whatsapp, telegram, email, copy]
 *     responses:
 *       200:
 *         description: Berhasil membuat URL berbagi
 */
router.post('/share', socialController.createShareUrl);

/**
 * @swagger
 * /social/track/{referralCode}:
 *   get:
 *     summary: Melacak klik pada URL berbagi
 *     tags: [Social]
 *     parameters:
 *       - in: path
 *         name: referralCode
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Berhasil melacak klik dan mendapatkan URL redirect
 */
router.get('/track/:referralCode', socialController.trackShareClick);

/**
 * @swagger
 * /social/conversion:
 *   post:
 *     summary: Melacak konversi (pembelian) dari URL berbagi
 *     tags: [Social]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - referralCode
 *               - orderId
 *             properties:
 *               referralCode:
 *                 type: string
 *               orderId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Berhasil melacak konversi
 */
router.post('/conversion', socialController.trackShareConversion);

// Rute yang memerlukan autentikasi admin
router.use(protect);
router.use(restrictTo('admin'));

/**
 * @swagger
 * /social/stats/{productId}:
 *   get:
 *     summary: Mendapatkan statistik berbagi untuk produk (admin)
 *     tags: [Social]
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
 *         description: Berhasil mendapatkan statistik berbagi
 */
router.get('/stats/:productId', socialController.getShareStats);

module.exports = router;