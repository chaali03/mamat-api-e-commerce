const express = require('express');
const router = express.Router();
const couponController = require('../controllers/couponController');
const { protect, restrictTo } = require('../controllers/authController');

/**
 * @swagger
 * /coupons/active:
 *   get:
 *     summary: Mendapatkan daftar kupon aktif
 *     tags: [Coupons]
 *     responses:
 *       200:
 *         description: Berhasil mendapatkan daftar kupon aktif
 */
router.get('/active', couponController.getActiveCoupons);

// Rute yang memerlukan autentikasi
router.use(protect);

/**
 * @swagger
 * /coupons/apply:
 *   post:
 *     summary: Menerapkan kupon ke keranjang
 *     tags: [Coupons]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - code
 *             properties:
 *               code:
 *                 type: string
 *     responses:
 *       200:
 *         description: Kupon berhasil diterapkan
 */
router.post('/apply', couponController.applyCoupon);

/**
 * @swagger
 * /coupons/remove:
 *   delete:
 *     summary: Menghapus kupon dari keranjang
 *     tags: [Coupons]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Kupon berhasil dihapus dari keranjang
 */
router.delete('/remove', couponController.removeCoupon);

// Rute yang memerlukan hak akses admin
router.use(restrictTo('admin'));

/**
 * @swagger
 * /coupons:
 *   get:
 *     summary: Mendapatkan semua kupon (admin)
 *     tags: [Coupons]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Berhasil mendapatkan daftar kupon
 */
router.get('/', couponController.getAllCoupons);

/**
 * @swagger
 * /coupons:
 *   post:
 *     summary: Membuat kupon baru (admin)
 *     tags: [Coupons]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Coupon'
 *     responses:
 *       201:
 *         description: Kupon berhasil dibuat
 */
router.post('/', couponController.createCoupon);

/**
 * @swagger
 * /coupons/{id}:
 *   get:
 *     summary: Mendapatkan kupon berdasarkan ID (admin)
 *     tags: [Coupons]
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
 *         description: Berhasil mendapatkan kupon
 */
router.get('/:id', couponController.getCoupon);

/**
 * @swagger
 * /coupons/{id}:
 *   patch:
 *     summary: Mengupdate kupon (admin)
 *     tags: [Coupons]
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
 *             $ref: '#/components/schemas/Coupon'
 *     responses:
 *       200:
 *         description: Kupon berhasil diupdate
 */
router.patch('/:id', couponController.updateCoupon);

/**
 * @swagger
 * /coupons/{id}:
 *   delete:
 *     summary: Menghapus kupon (admin)
 *     tags: [Coupons]
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
 *         description: Kupon berhasil dihapus
 */
router.delete('/:id', couponController.deleteCoupon);

module.exports = router;