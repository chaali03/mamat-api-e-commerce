const Cart = require('../models/cartModel');
const Product = require('../models/productModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

// Mendapatkan keranjang belanja pengguna
exports.getCart = catchAsync(async (req, res, next) => {
  const cart = await Cart.findOne({ user: req.user.id }).populate({
    path: 'items.product',
    select: 'name price images stock'
  });

  if (!cart) {
    return res.status(200).json({
      status: 'success',
      data: {
        items: [],
        totalItems: 0,
        totalPrice: 0
      }
    });
  }

  res.status(200).json({
    status: 'success',
    data: cart
  });
});

// Menambahkan item ke keranjang
exports.addItem = catchAsync(async (req, res, next) => {
  const { productId, quantity = 1 } = req.body;

  // Validasi produk
  const product = await Product.findById(productId);
  if (!product) {
    return next(new AppError('Produk tidak ditemukan', 404));
  }

  // Cek stok produk
  if (product.stock < quantity) {
    return next(new AppError('Stok produk tidak mencukupi', 400));
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

  res.status(200).json({
    status: 'success',
    data: cart
  });
});

// Mengupdate jumlah item di keranjang
exports.updateItem = catchAsync(async (req, res, next) => {
  const { itemId } = req.params;
  const { quantity } = req.body;

  if (!quantity || quantity < 1) {
    return next(new AppError('Jumlah harus lebih dari 0', 400));
  }

  const cart = await Cart.findOne({ user: req.user.id });
  if (!cart) {
    return next(new AppError('Keranjang tidak ditemukan', 404));
  }

  const itemIndex = cart.items.findIndex(item => 
    item._id.toString() === itemId
  );

  if (itemIndex === -1) {
    return next(new AppError('Item tidak ditemukan di keranjang', 404));
  }

  // Validasi stok produk
  const product = await Product.findById(cart.items[itemIndex].product);
  if (product.stock < quantity) {
    return next(new AppError('Stok produk tidak mencukupi', 400));
  }

  // Update jumlah
  cart.items[itemIndex].quantity = quantity;
  
  // Hitung ulang total
  cart.calculateTotals();
  await cart.save();

  res.status(200).json({
    status: 'success',
    data: cart
  });
});

// Menghapus item dari keranjang
exports.removeItem = catchAsync(async (req, res, next) => {
  const { itemId } = req.params;

  const cart = await Cart.findOne({ user: req.user.id });
  if (!cart) {
    return next(new AppError('Keranjang tidak ditemukan', 404));
  }

  const itemIndex = cart.items.findIndex(item => 
    item._id.toString() === itemId
  );

  if (itemIndex === -1) {
    return next(new AppError('Item tidak ditemukan di keranjang', 404));
  }

  // Hapus item
  cart.items.splice(itemIndex, 1);
  
  // Hitung ulang total
  cart.calculateTotals();
  await cart.save();

  res.status(200).json({
    status: 'success',
    data: cart
  });
});

// Mengosongkan keranjang
exports.clearCart = catchAsync(async (req, res, next) => {
  const cart = await Cart.findOne({ user: req.user.id });
  
  if (!cart) {
    return res.status(204).json({
      status: 'success',
      data: null
    });
  }

  cart.items = [];
  cart.calculateTotals();
  await cart.save();

  res.status(200).json({
    status: 'success',
    data: cart
  });
});