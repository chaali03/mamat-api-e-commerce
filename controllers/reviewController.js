const Review = require('../models/reviewModel');
const Product = require('../models/productModel');
const Order = require('../models/orderModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

// Mendapatkan semua review untuk produk tertentu
exports.getProductReviews = catchAsync(async (req, res, next) => {
  const { productId } = req.params;
  
  const reviews = await Review.find({ product: productId })
    .populate({
      path: 'user',
      select: 'name photo'
    })
    .sort('-createdAt');
  
  res.status(200).json({
    status: 'success',
    results: reviews.length,
    data: {
      reviews
    }
  });
});

// Mendapatkan review yang dibuat oleh pengguna yang login
exports.getMyReviews = catchAsync(async (req, res, next) => {
  const reviews = await Review.find({ user: req.user.id })
    .populate({
      path: 'product',
      select: 'name images price'
    })
    .sort('-createdAt');
  
  res.status(200).json({
    status: 'success',
    results: reviews.length,
    data: {
      reviews
    }
  });
});

// Mendapatkan review berdasarkan ID
exports.getReview = catchAsync(async (req, res, next) => {
  const review = await Review.findById(req.params.id)
    .populate({
      path: 'user',
      select: 'name photo'
    })
    .populate({
      path: 'product',
      select: 'name images price'
    });
  
  if (!review) {
    return next(new AppError('Review tidak ditemukan', 404));
  }
  
  res.status(200).json({
    status: 'success',
    data: {
      review
    }
  });
});

// Membuat review baru
exports.createReview = catchAsync(async (req, res, next) => {
  // Pastikan productId ada di body
  if (!req.body.product) {
    req.body.product = req.params.productId;
  }
  
  // Tambahkan user ID dari user yang login
  req.body.user = req.user.id;
  
  // Cek apakah produk ada
  const product = await Product.findById(req.body.product);
  if (!product) {
    return next(new AppError('Produk tidak ditemukan', 404));
  }
  
  // Cek apakah user sudah pernah membeli produk ini
  const hasPurchased = await Order.exists({
    user: req.user.id,
    'items.product': req.body.product,
    status: { $in: ['delivered', 'completed'] }
  });
  
  // Jika belum pernah membeli, tandai review sebagai tidak terverifikasi
  if (!hasPurchased) {
    req.body.verified = false;
  } else {
    req.body.verified = true;
  }
  
  // Cek apakah user sudah pernah review produk ini
  const existingReview = await Review.findOne({
    user: req.user.id,
    product: req.body.product
  });
  
  if (existingReview) {
    return next(new AppError('Anda sudah memberikan review untuk produk ini', 400));
  }
  
  // Buat review baru
  const newReview = await Review.create(req.body);
  
  res.status(201).json({
    status: 'success',
    data: {
      review: newReview
    }
  });
});

// Mengupdate review
exports.updateReview = catchAsync(async (req, res, next) => {
  const review = await Review.findById(req.params.id);
  
  if (!review) {
    return next(new AppError('Review tidak ditemukan', 404));
  }
  
  // Cek apakah user adalah pemilik review
  if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new AppError('Anda tidak memiliki izin untuk mengupdate review ini', 403));
  }
  
  // Update review
  const updatedReview = await Review.findByIdAndUpdate(
    req.params.id,
    {
      title: req.body.title,
      review: req.body.review,
      rating: req.body.rating,
      images: req.body.images,
      updatedAt: Date.now()
    },
    {
      new: true,
      runValidators: true
    }
  );
  
  res.status(200).json({
    status: 'success',
    data: {
      review: updatedReview
    }
  });
});

// Menghapus review
exports.deleteReview = catchAsync(async (req, res, next) => {
  const review = await Review.findById(req.params.id);
  
  if (!review) {
    return next(new AppError('Review tidak ditemukan', 404));
  }
  
  // Cek apakah user adalah pemilik review atau admin
  if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new AppError('Anda tidak memiliki izin untuk menghapus review ini', 403));
  }
  
  await Review.findByIdAndDelete(req.params.id);
  
  res.status(204).json({
    status: 'success',
    data: null
  });
});

// Menyukai review
exports.likeReview = catchAsync(async (req, res, next) => {
  const review = await Review.findById(req.params.id);
  
  if (!review) {
    return next(new AppError('Review tidak ditemukan', 404));
  }
  
  // Tambah jumlah like
  review.likes += 1;
  await review.save();
  
  res.status(200).json({
    status: 'success',
    data: {
      review
    }
  });
});

// Mendapatkan statistik rating untuk produk
exports.getProductRatingStats = catchAsync(async (req, res, next) => {
  const { productId } = req.params;
  
  const stats = await Review.aggregate([
    {
      $match: { product: mongoose.Types.ObjectId(productId) }
    },
    {
      $group: {
        _id: '$rating',
        count: { $sum: 1 }
      }
    },
    {
      $sort: { _id: -1 }
    }
  ]);
  
  // Format hasil untuk mudah digunakan di frontend
  const formattedStats = {
    total: 0,
    average: 0,
    ratings: {
      5: 0,
      4: 0,
      3: 0,
      2: 0,
      1: 0
    }
  };
  
  let totalRatings = 0;
  let sumRatings = 0;
  
  stats.forEach(stat => {
    formattedStats.ratings[stat._id] = stat.count;
    totalRatings += stat.count;
    sumRatings += stat._id * stat.count;
  });
  
  formattedStats.total = totalRatings;
  formattedStats.average = totalRatings > 0 ? (sumRatings / totalRatings).toFixed(1) : 0;
  
  res.status(200).json({
    status: 'success',
    data: {
      stats: formattedStats
    }
  });
});