const Coupon = require('../models/couponModel');
const Cart = require('../models/cartModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

// Mendapatkan semua kupon (admin)
exports.getAllCoupons = catchAsync(async (req, res, next) => {
  const coupons = await Coupon.find();
  
  res.status(200).json({
    status: 'success',
    results: coupons.length,
    data: {
      coupons
    }
  });
});

// Mendapatkan kupon aktif (publik)
exports.getActiveCoupons = catchAsync(async (req, res, next) => {
  const now = new Date();
  
  const coupons = await Coupon.find({
    isActive: true,
    startDate: { $lte: now },
    endDate: { $gte: now },
    $or: [
      { usageLimit: null },
      { usedCount: { $lt: '$usageLimit' } }
    ]
  }).select('code type amount minPurchase maxDiscount endDate description');
  
  res.status(200).json({
    status: 'success',
    results: coupons.length,
    data: {
      coupons
    }
  });
});

// Mendapatkan kupon berdasarkan ID
exports.getCoupon = catchAsync(async (req, res, next) => {
  const coupon = await Coupon.findById(req.params.id);
  
  if (!coupon) {
    return next(new AppError('Kupon tidak ditemukan', 404));
  }
  
  res.status(200).json({
    status: 'success',
    data: {
      coupon
    }
  });
});

// Membuat kupon baru (admin)
exports.createCoupon = catchAsync(async (req, res, next) => {
  const newCoupon = await Coupon.create(req.body);
  
  res.status(201).json({
    status: 'success',
    data: {
      coupon: newCoupon
    }
  });
});

// Mengupdate kupon (admin)
exports.updateCoupon = catchAsync(async (req, res, next) => {
  const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  
  if (!coupon) {
    return next(new AppError('Kupon tidak ditemukan', 404));
  }
  
  res.status(200).json({
    status: 'success',
    data: {
      coupon
    }
  });
});

// Menghapus kupon (admin)
exports.deleteCoupon = catchAsync(async (req, res, next) => {
  const coupon = await Coupon.findByIdAndDelete(req.params.id);
  
  if (!coupon) {
    return next(new AppError('Kupon tidak ditemukan', 404));
  }
  
  res.status(204).json({
    status: 'success',
    data: null
  });
});

// Validasi dan aplikasi kupon ke keranjang
exports.applyCoupon = catchAsync(async (req, res, next) => {
  const { code } = req.body;
  
  // Cari kupon berdasarkan kode
  const coupon = await Coupon.findOne({
    code: code.toUpperCase(),
    isActive: true
  });
  
  if (!coupon) {
    return next(new AppError('Kupon tidak valid atau tidak ditemukan', 400));
  }
  
  // Cek apakah kupon masih berlaku
  if (!coupon.isValid) {
    return next(new AppError('Kupon sudah tidak berlaku atau habis', 400));
  }
  
  // Cari keranjang pengguna
  const cart = await Cart.findOne({ user: req.user.id }).populate({
    path: 'items.product',
    select: 'name price category'
  });
  
  if (!cart || cart.items.length === 0) {
    return next(new AppError('Keranjang kosong', 400));
  }
  
  // Hitung subtotal
  const subtotal = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  // Cek minimum pembelian
  if (subtotal < coupon.minPurchase) {
    return next(new AppError(`Minimum pembelian untuk kupon ini adalah ${coupon.minPurchase}`, 400));
  }
  
  // Cek apakah kupon berlaku untuk produk di keranjang
  if (coupon.applicableProducts && coupon.applicableProducts.length > 0) {
    const hasApplicableProduct = cart.items.some(item => 
      coupon.applicableProducts.includes(item.product._id)
    );
    
    if (!hasApplicableProduct) {
      return next(new AppError('Kupon tidak berlaku untuk produk di keranjang', 400));
    }
  }
  
  // Cek apakah kupon berlaku untuk kategori di keranjang
  if (coupon.applicableCategories && coupon.applicableCategories.length > 0) {
    const hasApplicableCategory = cart.items.some(item => 
      coupon.applicableCategories.includes(item.product.category)
    );
    
    if (!hasApplicableCategory) {
      return next(new AppError('Kupon tidak berlaku untuk kategori produk di keranjang', 400));
    }
  }
  
  // Hitung diskon
  const discount = coupon.calculateDiscount(subtotal);
  
  // Update keranjang dengan kupon dan diskon
  cart.coupon = coupon._id;
  cart.discount = discount;
  cart.calculateTotals();
  await cart.save();
  
  res.status(200).json({
    status: 'success',
    message: 'Kupon berhasil diterapkan',
    data: {
      cart,
      discount
    }
  });
});

// Menghapus kupon dari keranjang
exports.removeCoupon = catchAsync(async (req, res, next) => {
  const cart = await Cart.findOne({ user: req.user.id });
  
  if (!cart) {
    return next(new AppError('Keranjang tidak ditemukan', 404));
  }
  
  // Hapus kupon dan diskon
  cart.coupon = undefined;
  cart.discount = 0;
  cart.calculateTotals();
  await cart.save();
  
  res.status(200).json({
    status: 'success',
    message: 'Kupon berhasil dihapus dari keranjang',
    data: {
      cart
    }
  });
});