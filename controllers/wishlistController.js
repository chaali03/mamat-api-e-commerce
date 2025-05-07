const Wishlist = require('../models/Wishlist');
const Product = require('../models/Product');
const Cart = require('../models/Cart');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

// Get user's wishlist
exports.getWishlist = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  
  let wishlist = await Wishlist.findOne({ user: userId })
    .populate({
      path: 'items.product',
      select: 'name price images stock discount'
    });
  
  if (!wishlist) {
    wishlist = await Wishlist.create({ user: userId, items: [] });
  }
  
  res.status(200).json({
    status: 'success',
    data: {
      wishlist: {
        items: wishlist.items,
        totalItems: wishlist.items.length
      }
    }
  });
});

// Add product to wishlist
exports.addToWishlist = catchAsync(async (req, res, next) => {
  const { productId } = req.params;
  const userId = req.user.id;
  
  // Validate product
  const product = await Product.findById(productId);
  if (!product) {
    return next(new AppError('Produk tidak ditemukan', 404));
  }
  
  // Find or create wishlist
  let wishlist = await Wishlist.findOne({ user: userId });
  if (!wishlist) {
    wishlist = await Wishlist.create({ user: userId, items: [] });
  }
  
  // Check if product is already in wishlist
  const itemExists = wishlist.items.some(item => 
    item.product.toString() === productId
  );
  
  if (itemExists) {
    return next(new AppError('Produk sudah ada di wishlist', 400));
  }
  
  // Add product to wishlist
  wishlist.items.push({
    product: productId
  });
  
  await wishlist.save();
  
  res.status(200).json({
    status: 'success',
    message: 'Produk berhasil ditambahkan ke wishlist',
    data: {
      wishlist
    }
  });
});

// Remove product from wishlist
exports.removeFromWishlist = catchAsync(async (req, res, next) => {
  const { productId } = req.params;
  const userId = req.user.id;
  
  const wishlist = await Wishlist.findOne({ user: userId });
  if (!wishlist) {
    return next(new AppError('Wishlist tidak ditemukan', 404));
  }
  
  const itemIndex = wishlist.items.findIndex(item => 
    item.product.toString() === productId
  );
  
  if (itemIndex === -1) {
    return next(new AppError('Produk tidak ditemukan di wishlist', 404));
  }
  
  wishlist.items.splice(itemIndex, 1);
  await wishlist.save();
  
  res.status(200).json({
    status: 'success',
    message: 'Produk berhasil dihapus dari wishlist',
    data: {
      wishlist
    }
  });
});

// Move product from wishlist to cart
exports.moveToCart = catchAsync(async (req, res, next) => {
  const { productId } = req.params;
  const userId = req.user.id;
  
  // Find wishlist
  const wishlist = await Wishlist.findOne({ user: userId });
  if (!wishlist) {
    return next(new AppError('Wishlist tidak ditemukan', 404));
  }
  
  // Check if product is in wishlist
  const itemIndex = wishlist.items.findIndex(item => 
    item.product.toString() === productId
  );
  
  if (itemIndex === -1) {
    return next(new AppError('Produk tidak ditemukan di wishlist', 404));
  }
  
  // Validate product
  const product = await Product.findById(productId);
  if (!product) {
    return next(new AppError('Produk tidak ditemukan', 404));
  }
  
  // Find or create cart
  let cart = await Cart.findOne({ user: userId });
  if (!cart) {
    cart = await Cart.create({ user: userId, items: [] });
  }
  
  // Check if product is already in cart
  const cartItemIndex = cart.items.findIndex(item => 
    item.product.toString() === productId
  );
  
  if (cartItemIndex > -1) {
    // Product already in cart, increment quantity
    cart.items[cartItemIndex].quantity += 1;
  } else {
    // Add product to cart
    cart.items.push({
      product: productId,
      quantity: 1
    });
  }
  
  // Remove from wishlist
  wishlist.items.splice(itemIndex, 1);
  
  // Save both documents
  await Promise.all([
    cart.save(),
    wishlist.save()
  ]);
  
  res.status(200).json({
    status: 'success',
    message: 'Produk berhasil dipindahkan ke keranjang',
    data: {
      cart,
      wishlist
    }
  });
});