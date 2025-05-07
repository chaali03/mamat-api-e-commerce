const express = require('express');
const router = express.Router();

// GET /api/v1/coupons - Mendapatkan semua kupon
router.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Daftar semua kupon',
    data: []
  });
});

// GET /api/v1/coupons/:id - Mendapatkan kupon berdasarkan ID
router.get('/:id', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: `Detail kupon dengan ID ${req.params.id}`,
    data: {
      id: req.params.id,
      code: 'EXAMPLE',
      discount: 10,
      type: 'percentage',
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    }
  });
});

// POST /api/v1/coupons - Membuat kupon baru
router.post('/', (req, res) => {
  res.status(201).json({
    status: 'success',
    message: 'Kupon berhasil dibuat',
    data: req.body
  });
});

// PUT /api/v1/coupons/:id - Memperbarui kupon
router.put('/:id', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: `Kupon dengan ID ${req.params.id} berhasil diperbarui`,
    data: {
      id: req.params.id,
      ...req.body
    }
  });
});

// DELETE /api/v1/coupons/:id - Menghapus kupon
router.delete('/:id', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: `Kupon dengan ID ${req.params.id} berhasil dihapus`
  });
});

// POST /api/v1/coupons/validate - Memvalidasi kupon
router.post('/validate', (req, res) => {
  const { code } = req.body;
  
  if (!code) {
    return res.status(400).json({
      status: 'error',
      message: 'Kode kupon harus disediakan'
    });
  }
  
  res.status(200).json({
    status: 'success',
    message: 'Kupon valid',
    data: {
      code,
      valid: true,
      discount: 10,
      type: 'percentage'
    }
  });
});

module.exports = router;