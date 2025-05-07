const Wishlist = require('../models/wishlistModel');
const Product = require('../models/productModel');
const Cart = require('../models/cartModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

// Mendapatkan wishlist pengguna
exports.getWishlist = catchAsync(async (req, res, next) => {
  let wishlist = await Wishlist.findOne({ user: req.user.id }).populate({
    path: 'products',
    select: 'name price images description stock'
  });

  if (!wishlist) {
    wishlist = await Wishlist.create({
      user: req.user.id,
      products: []
    });
  }

  res.status(200).json({
    status: 'success',
    data: {
      wishlist
    }
  });
});

// Menambahkan produk ke wishlist
exports.addToWishlist = catchAsync(async (req, res, next) => {
  const { productId } = req.body;

  // Validasi produk
  const product = await Product.findById(productId);
  if (!product) {
    return next(new AppError('Produk tidak ditemukan', 404));
  }

  // Cari atau buat wishlist
  let wishlist = await Wishlist.findOne({ user: req.user.id });
  if (!wishlist) {
    wishlist = await Wishlist.create({
      user: req.user.id,
      products: []
    });
  }

  // Cek apakah produk sudah ada di wishlist
  if (wishlist.products.includes(productId)) {
    return res.status(200).json({
      status: 'success',
      message: 'Produk sudah ada di wishlist',
      data: {
        wishlist
      }
    });
  }

  // Tambahkan produk ke wishlist
  wishlist.products.push(productId);
  await wishlist.save();

  res.status(200).json({
    status: 'success',
    message: 'Produk berhasil ditambahkan ke wishlist',
    data: {
      wishlist
    }
  });
});

// Menghapus produk dari wishlist
exports.removeFromWishlist = catchAsync(async (req, res, next) => {
  const { productId } = req.params;

  const wishlist = await Wishlist.findOne({ user: req.user.id });
  if (!wishlist) {
    return next(new AppError('Wishlist tidak ditemukan', 404));
  }

  // Cek apakah produk ada di wishlist
  const productIndex = wishlist.products.indexOf(productId);
  if (productIndex === -1) {
    return next(new AppError('Produk tidak ditemukan di wishlist', 404));
  }

  // Hapus produk dari wishlist
  wishlist.products.splice(productIndex, 1);
  await wishlist.save();

  res.status(200).json({
    status: 'success',
    message: 'Produk berhasil dihapus dari wishlist',
    data: {
      wishlist
    }
  });
});

// Memindahkan produk dari wishlist ke keranjang
exports.moveToCart = catchAsync(async (req, res, next) => {
  const { productId } = req.params;
  const { quantity = 1 } = req.body;

  // Validasi produk
  const product = await Product.findById(productId);
  if (!product) {
    return next(new AppError('Produk tidak ditemukan', 404));
  }

  // Cek stok produk
  if (product.stock < quantity) {
    return next(new AppError('Stok produk tidak mencukupi', 400));
  }

  // Cari wishlist
  const wishlist = await Wishlist.findOne({ user: req.user.id });
  if (!wishlist) {
    return next(new AppError('Wishlist tidak ditemukan', 404));
  }

  // Cek apakah produk ada di wishlist
  const productIndex = wishlist.products.indexOf(productId);
  if (productIndex === -1) {
    return next(new AppError('Produk tidak ditemukan di wishlist', 404));
  }

  // Cari atau buat keranjang
  let cart = await Cart.findOne({ user: req.user.id });
  if (!cart) {
    cart = await Cart.create({ user: req.user.id, items: [] });
  }

  // Cek apakah produk sudah ada di keranjang
  const itemIndex = cart.items.findIndex(item => 
    item.product.toString() === productId
  );

  if (itemIndex > -1) {
    // Produk sudah ada, update jumlah
    cart.items[itemIndex].quantity += quantity;
  } else {
    // Produk belum ada, tambahkan ke keranjang
    cart.items.push({
      product: productId,
      quantity,
      price: product.price
    });
  }

  // Hitung ulang total
  cart.calculateTotals();
  await cart.save();

  // Hapus produk dari wishlist (opsional)
  wishlist.products.splice(productIndex, 1);
  await wishlist.save();

  res.status(200).json({
    status: 'success',
    message: 'Produk berhasil dipindahkan ke keranjang',
    data: {
      cart,
      wishlist
    }
  });
});