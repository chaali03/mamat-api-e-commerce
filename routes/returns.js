const express = require('express');
const router = express.Router();
const returnController = require('../controllers/returnController');
const { authenticate } = require('../middleware/auth');

// Mengajukan pengembalian produk
router.post('/create', authenticate, returnController.createReturn);

// Mendapatkan semua pengembalian user
router.get('/', authenticate, returnController.getUserReturns);

// Mendapatkan detail pengembalian
router.get('/:returnId', authenticate, returnController.getReturnDetails);

// Membatalkan pengajuan pengembalian
router.put('/:returnId/cancel', authenticate, returnController.cancelReturn);

// Melacak status pengembalian
router.get('/:returnId/status', authenticate, returnController.trackReturnStatus);

module.exports = router;