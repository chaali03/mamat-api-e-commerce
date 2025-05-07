const Compare = require('../models/compareModel');
const Product = require('../models/productModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

// Mendapatkan daftar perbandingan produk pengguna
exports.getCompareList = catchAsync(async (req, res, next) => {
  let compareList = await Compare.findOne({ user: req.user.id }).populate({
    path: 'products',
    select: 'name price images description brand category stock ratingsAverage specifications'
  });

  if (!compareList) {
    compareList = await Compare.create({
      user: req.user.id,
      products: []
    });
  }

  res.status(200).json({
    status: 'success',
    data: {
      compareList
    }
  });
});

// Menambahkan produk ke daftar perbandingan
exports.addToCompare = catchAsync(async (req, res, next) => {
  const { productId } = req.body;

  // Validasi produk
  const product = await Product.findById(productId);
  if (!product) {
    return next(new AppError('Produk tidak ditemukan', 404));
  }

  // Cari atau buat daftar perbandingan
  let compareList = await Compare.findOne({ user: req.user.id });
  if (!compareList) {
    compareList = await Compare.create({
      user: req.user.id,
      products: []
    });
  }

  // Cek apakah produk sudah ada di daftar perbandingan
  if (compareList.products.includes(productId)) {
    return res.status(200).json({
      status: 'success',
      message: 'Produk sudah ada di daftar perbandingan',
      data: {
        compareList
      }
    });
  }

  // Cek apakah sudah mencapai batas maksimal (4 produk)
  if (compareList.products.length >= 4) {
    return next(new AppError('Maksimal 4 produk yang dapat dibandingkan. Hapus salah satu produk terlebih dahulu.', 400));
  }

  // Tambahkan produk ke daftar perbandingan
  compareList.products.push(productId);
  await compareList.save();

  // Populate produk untuk respons
  compareList = await Compare.findById(compareList._id).populate({
    path: 'products',
    select: 'name price images description brand category stock ratingsAverage specifications'
  });

  res.status(200).json({
    status: 'success',
    message: 'Produk berhasil ditambahkan ke daftar perbandingan',
    data: {
      compareList
    }
  });
});

// Menghapus produk dari daftar perbandingan
exports.removeFromCompare = catchAsync(async (req, res, next) => {
  const { productId } = req.params;

  const compareList = await Compare.findOne({ user: req.user.id });
  if (!compareList) {
    return next(new AppError('Daftar perbandingan tidak ditemukan', 404));
  }

  // Cek apakah produk ada di daftar perbandingan
  const productIndex = compareList.products.indexOf(productId);
  if (productIndex === -1) {
    return next(new AppError('Produk tidak ditemukan di daftar perbandingan', 404));
  }

  // Hapus produk dari daftar perbandingan
  compareList.products.splice(productIndex, 1);
  await compareList.save();

  // Populate produk untuk respons
  const updatedCompareList = await Compare.findById(compareList._id).populate({
    path: 'products',
    select: 'name price images description brand category stock ratingsAverage specifications'
  });

  res.status(200).json({
    status: 'success',
    message: 'Produk berhasil dihapus dari daftar perbandingan',
    data: {
      compareList: updatedCompareList
    }
  });
});

// Mengosongkan daftar perbandingan
exports.clearCompare = catchAsync(async (req, res, next) => {
  const compareList = await Compare.findOne({ user: req.user.id });
  
  if (!compareList) {
    return res.status(204).json({
      status: 'success',
      data: null
    });
  }

  compareList.products = [];
  await compareList.save();

  res.status(200).json({
    status: 'success',
    message: 'Daftar perbandingan berhasil dikosongkan',
    data: {
      compareList
    }
  });
});

// Membandingkan produk berdasarkan ID (untuk pengguna yang tidak login)
exports.compareProducts = catchAsync(async (req, res, next) => {
  const { productIds } = req.body;

  if (!productIds || !Array.isArray(productIds) || productIds.length < 2) {
    return next(new AppError('Minimal 2 produk yang harus dibandingkan', 400));
  }

  if (productIds.length > 4) {
    return next(new AppError('Maksimal 4 produk yang dapat dibandingkan', 400));
  }

  // Ambil produk dari database
  const products = await Product.find({
    _id: { $in: productIds }
  }).select('name price images description brand category stock ratingsAverage specifications');

  if (products.length !== productIds.length) {
    return next(new AppError('Beberapa produk tidak ditemukan', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      products
    }
  });
});