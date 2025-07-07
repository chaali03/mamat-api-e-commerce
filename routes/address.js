const express = require('express');
const router = express.Router();
const addressController = require('../controllers/addressController');
import authenticate from '../middleware/auth.js';

// Mendapatkan semua alamat user
router.get('/', authenticate, addressController.getUserAddresses);

// Menambahkan alamat baru
router.post('/add', authenticate, addressController.addAddress);

// Mengupdate alamat
router.put('/:addressId', authenticate, addressController.updateAddress);

// Menghapus alamat
router.delete('/:addressId', authenticate, addressController.deleteAddress);

// Menetapkan alamat default
router.put('/:addressId/set-default', authenticate, addressController.setDefaultAddress);

module.exports = router;