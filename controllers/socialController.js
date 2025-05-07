const SocialShare = require('../models/socialShareModel');
const Product = require('../models/productModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const crypto = require('crypto');

// Membuat URL berbagi untuk produk
exports.createShareUrl = catchAsync(async (req, res, next) => {
  const { productId, platform } = req.body;

  // Validasi produk
  const product = await Product.findById(productId);
  if (!product) {
    return next(new AppError('Produk tidak ditemukan', 404));
  }

  // Validasi platform
  const validPlatforms = ['facebook', 'twitter', 'instagram', 'whatsapp', 'telegram', 'email', 'copy'];
  if (!validPlatforms.includes(platform)) {
    return next(new AppError('Platform tidak valid', 400));
  }

  // Buat data berbagi sosial
  const socialShare = await SocialShare.create({
    user: req.user ? req.user.id : null,
    product: productId,
    platform,
    ipAddress: req.ip,
    userAgent: req.headers['user-agent']
  });

  // Buat URL berbagi berdasarkan platform
  const baseUrl = process.env.FRONTEND_URL || 'https://mamat.com';
  const productUrl = `${baseUrl}/products/${product.slug || product._id}?ref=${socialShare.referralCode}`;
  
  let shareUrl;
  
  switch (platform) {
    case 'facebook':
      shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(productUrl)}`;
      break;
    case 'twitter':
      shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(productUrl)}&text=${encodeURIComponent(`Cek produk ${product.name} di Mamat Gaming!`)}`;
      break;
    case 'whatsapp':
      shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(`Cek produk ${product.name} di Mamat Gaming! ${productUrl}`)}`;
      break;
    case 'telegram':
      shareUrl = `https://t.me/share/url?url=${encodeURIComponent(productUrl)}&text=${encodeURIComponent(`Cek produk ${product.name} di Mamat Gaming!`)}`;
      break;
    case 'email':
      shareUrl = `mailto:?subject=${encodeURIComponent(`Produk Menarik dari Mamat Gaming`)}&body=${encodeURIComponent(`Halo, cek produk ${product.name} di Mamat Gaming! ${productUrl}`)}`;
      break;
    default:
      shareUrl = productUrl;
  }

  // Update URL berbagi
  socialShare.shareUrl = shareUrl;
  await socialShare.save();

  res.status(200).json({
    status: 'success',
    data: {
      shareUrl,
      productUrl,
      referralCode: socialShare.referralCode,
      platform
    }
  });
});

// Melacak klik pada URL berbagi
exports.trackShareClick = catchAsync(async (req, res, next) => {
  const { referralCode } = req.params;

  // Cari data berbagi berdasarkan referral code
  const socialShare = await SocialShare.findOne({ referralCode });
  
  if (!socialShare) {
    return next(new AppError('Referral code tidak valid', 404));
  }

  // Tambah jumlah klik
  socialShare.clickCount += 1;
  await socialShare.save();

  // Redirect ke halaman produk
  const product = await Product.findById(socialShare.product);
  
  if (!product) {
    return next(new AppError('Produk tidak ditemukan', 404));
  }

  const baseUrl = process.env.FRONTEND_URL || 'https://mamat.com';
  const redirectUrl = `${baseUrl}/products/${product.slug || product._id}`;

  res.status(200).json({
    status: 'success',
    data: {
      redirectUrl
    }
  });
});

// Melacak konversi (pembelian) dari URL berbagi
exports.trackShareConversion = catchAsync(async (req, res, next) => {
  const { referralCode, orderId } = req.body;

  // Cari data berbagi berdasarkan referral code
  const socialShare = await SocialShare.findOne({ referralCode });
  
  if (!socialShare) {
    return next(new AppError('Referral code tidak valid', 404));
  }

  // Tambah jumlah konversi
  socialShare.conversionCount += 1;
  await socialShare.save();

  res.status(200).json({
    status: 'success',
    message: 'Konversi berhasil dicatat'
  });
});

// Mendapatkan statistik berbagi untuk produk
exports.getShareStats = catchAsync(async (req, res, next) => {
  const { productId } = req.params;

  // Validasi produk
  const product = await Product.findById(productId);
  if (!product) {
    return next(new AppError('Produk tidak ditemukan', 404));
  }

  // Hanya admin yang dapat melihat statistik
  if (req.user.role !== 'admin') {
    return next(new AppError('Anda tidak memiliki izin untuk melihat statistik', 403));
  }

  // Ambil statistik berbagi
  const stats = await SocialShare.aggregate([
    {
      $match: { product: mongoose.Types.ObjectId(productId) }
    },
    {
      $group: {
        _id: '$platform',
        shareCount: { $sum: 1 },
        clickCount: { $sum: '$clickCount' },
        conversionCount: { $sum: '$conversionCount' }
      }
    },
    {
      $sort: { shareCount: -1 }
    }
  ]);

  // Hitung total
  const totalStats = {
    shareCount: 0,
    clickCount: 0,
    conversionCount: 0
  };

  stats.forEach(stat => {
    totalStats.shareCount += stat.shareCount;
    totalStats.clickCount += stat.clickCount;
    totalStats.conversionCount += stat.conversionCount;
  });

  res.status(200).json({
    status: 'success',
    data: {
      stats,
      totalStats
    }
  });
});