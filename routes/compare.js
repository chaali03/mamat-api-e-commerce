const express = require('express');
const router = express.Router();

// GET /api/compare - Mendapatkan daftar produk yang dibandingkan
router.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Fitur perbandingan produk',
    data: []
  });
});

// POST /api/compare - Menambahkan produk ke daftar perbandingan
router.post('/', (req, res) => {
  res.status(201).json({
    status: 'success',
    message: 'Produk berhasil ditambahkan ke perbandingan',
    data: req.body
  });
});

// DELETE /api/compare/:id - Menghapus produk dari daftar perbandingan
router.delete('/:id', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: `Produk dengan ID ${req.params.id} berhasil dihapus dari perbandingan`
  });
});

module.exports = router;