const express = require('express');
const router = express.Router();

// GET /api/social/share - Mendapatkan informasi berbagi produk
router.get('/share/:productId', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Informasi berbagi produk',
    data: {
      productId: req.params.productId,
      shareUrl: `https://adashoop.com/product/${req.params.productId}`,
      socialPlatforms: ['facebook', 'twitter', 'whatsapp', 'telegram']
    }
  });
});

// POST /api/social/share - Mencatat aktivitas berbagi
router.post('/share', (req, res) => {
  res.status(201).json({
    status: 'success',
    message: 'Aktivitas berbagi berhasil dicatat',
    data: req.body
  });
});

// GET /api/social/follow - Mendapatkan daftar toko yang diikuti
router.get('/follow', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Daftar toko yang diikuti',
    data: []
  });
});

// POST /api/social/follow/:storeId - Mengikuti toko
router.post('/follow/:storeId', (req, res) => {
  res.status(201).json({
    status: 'success',
    message: `Berhasil mengikuti toko dengan ID ${req.params.storeId}`,
    data: {
      storeId: req.params.storeId,
      followedAt: new Date()
    }
  });
});

// DELETE /api/social/follow/:storeId - Berhenti mengikuti toko
router.delete('/follow/:storeId', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: `Berhasil berhenti mengikuti toko dengan ID ${req.params.storeId}`
  });
});

module.exports = router;