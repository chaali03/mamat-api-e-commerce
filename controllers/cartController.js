const Cart = require('../models/Cart');
const Product = require('../models/Product');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getCart = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  
  let cart = await Cart.findOne({ user: userId })
    .populate({
      path: 'items.product',
      select: 'name price images stock discount'
    });
  
  if (!cart) {
    cart = await Cart.create({ user: userId, items: [] });
  }
  
  // Calculate the total price
  let totalPrice = 0;
  cart.items.forEach(item => {
    const price = item.product.discount 
      ? item.product.price * (1 - item.product.discount / 100) 
      : item.product.price;
    totalPrice += price * item.quantity;
  });
  
  res.status(200).json({
    status: 'success',
    data: {
      cart: {
        items: cart.items,
        totalItems: cart.items.length,
        totalPrice: Math.round(totalPrice * 100) / 100
      }
    }
  });
});

exports.addToCart = catchAsync(async (req, res, next) => {
  const { productId, quantity = 1 } = req.body;
  const userId = req.user.id;
  
  // Product validation
  const product = await Product.findById(productId);
  if (!product) {
    return next(new AppError('Produk tidak ditemukan', 404));
  }
  
  // Stock validation
  if (product.stock < quantity) {
    return next(new AppError('Stok produk tidak mencukupi', 400));
  }
  
  // Find or create a cart
  let cart = await Cart.findOne({ user: userId });
  if (!cart) {
    cart = await Cart.create({ user: userId, items: [] });
  }
  
  // Check if the product is already in the cart
  const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
  
  if (itemIndex > -1) {
    // Product already exists, update quantity
    cart.items[itemIndex].quantity += quantity;
  } else {
    // Product not available yet, add to cart
    cart.items.push({
      product: productId,
      quantity
    });
  }
  
  await cart.save();
  
  res.status(200).json({
    status: 'success',
    message: 'Produk berhasil ditambahkan ke keranjang',
    data: {
      cart
    }
  });
});

exports.updateCartItem = catchAsync(async (req, res, next) => {
  const { itemId } = req.params;
  const { quantity } = req.body;
  const userId = req.user.id;
  
  if (!quantity || quantity < 1) {
    return next(new AppError('Jumlah produk tidak valid', 400));
  }
  
  const cart = await Cart.findOne({ user: userId });
  if (!cart) {
    return next(new AppError('Keranjang tidak ditemukan', 404));
  }
  
  const itemIndex = cart.items.findIndex(item => item._id.toString() === itemId);
  if (itemIndex === -1) {
    return next(new AppError('Item tidak ditemukan di keranjang', 404));
  }
  
  // Stock validation
  const product = await Product.findById(cart.items[itemIndex].product);
  if (product.stock < quantity) {
    return next(new AppError('Stok produk tidak mencukupi', 400));
  }
  
  cart.items[itemIndex].quantity = quantity;
  await cart.save();
  
  res.status(200).json({
    status: 'success',
    message: 'Keranjang berhasil diupdate',
    data: {
      cart
    }
  });
});

exports.removeFromCart = catchAsync(async (req, res, next) => {
  const { itemId } = req.params;
  const userId = req.user.id;
  
  const cart = await Cart.findOne({ user: userId });
  if (!cart) {
    return next(new AppError('Keranjang tidak ditemukan', 404));
  }
  
  const itemIndex = cart.items.findIndex(item => item._id.toString() === itemId);
  if (itemIndex === -1) {
    return next(new AppError('Item tidak ditemukan di keranjang', 404));
  }
  
  cart.items.splice(itemIndex, 1);
  await cart.save();
  
  res.status(200).json({
    status: 'success',
    message: 'Produk berhasil dihapus dari keranjang',
    data: {
      cart
    }
  });
});

exports.clearCart = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  
  const cart = await Cart.findOne({ user: userId });
  if (!cart) {
    return next(new AppError('Keranjang tidak ditemukan', 404));
  }
  
  cart.items = [];
  await cart.save();
  
  res.status(200).json({
    status: 'success',
    message: 'Keranjang berhasil dikosongkan',
    data: {
      cart
    }
  });
});

exports.checkout = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  

// Checkout implementation will be connected to order controller
// Checkout logic will move items from cart to order
  
  res.status(200).json({
    status: 'success',
    message: 'Checkout berhasil',
    data: {
      orderId: 'sample-order-id'   // This will be replaced with the actual order ID
    }
  });
});