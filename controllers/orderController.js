const Order = require('../models/Order');
const Product = require('../models/Product');
const Cart = require('../models/Cart');
const User = require('../models/User');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const logger = require('../utils/logger');
const { sendOrderConfirmationEmail } = require('../utils/email');
const { generateOrderId, calculateOrderTotal } = require('../utils/orderHelpers');
const stripe = process.env.STRIPE_SECRET_KEY 
  ? require('stripe')(process.env.STRIPE_SECRET_KEY) 
  : { 
      paymentIntents: { 
        create: () => ({ client_secret: 'dummy_secret' }) 
      } 
    };

// Redis setup for caching
let redisClient = { connected: false };
try {
  const redis = require('redis');
  const { promisify } = require('util');
  
  redisClient = redis.createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379',
    password: process.env.REDIS_PASSWORD || ''
  });
  
  redisClient.on('error', (err) => {
    logger.error('Redis error:', err);
    redisClient.connected = false;
  });
  
  redisClient.on('connect', () => {
    logger.info('Connected to Redis');
    redisClient.connected = true;
  });
} catch (err) {
  redisClient = {
    connected: false,
    get: () => {},
    set: () => {},
    del: () => {},
    on: () => {}
  };
  logger.info('Redis module not found, continuing without Redis caching');
}

// Cache middleware
const cacheMiddleware = (key, ttl = 3600) => {
  return function(handler) {
    return catchAsync(async (req, res, next) => {
      // Skip caching if Redis is not available
      if (!redisClient || !redisClient.connected) {
        return handler(req, res, next);
      }
      
      const cacheKey = `${key}:${req.originalUrl}`;
      const cachedData = await promisify(redisClient.get).bind(redisClient)(cacheKey);
      
      if (cachedData) {
        logger.info(`Serving from cache: ${cacheKey}`);
        return res.status(200).json(JSON.parse(cachedData));
      }
      
      res.sendResponse = res.json;
      res.json = (body) => {
        if (redisClient && redisClient.connected) {
          redisClient.set(cacheKey, JSON.stringify(body), 'EX', ttl, (err) => {
            if (err) logger.error('Redis set error:', err);
          });
        }
        return res.sendResponse(body);
      };
      
      return handler(req, res, next);
    });
  };
};

/**
 * @desc    Create new order
 * @route   POST /api/v1/orders
 * @access  Private
 */
exports.createOrder = catchAsync(async (req, res, next) => {
  const { 
    shippingAddress, 
    paymentMethod, 
    shippingMethod,
    notes
  } = req.body;
  
  // Validate required fields
  if (!shippingAddress || !paymentMethod || !shippingMethod) {
    return next(new AppError('Alamat pengiriman, metode pembayaran, dan metode pengiriman wajib diisi', 400));
  }
  
  // Get user's cart
  const cart = await Cart.findOne({ user: req.user.id }).populate({
    path: 'items.product',
    select: 'name price stock images sku discountPercentage weight'
  });
  
  if (!cart || cart.items.length === 0) {
    return next(new AppError('Keranjang belanja kosong', 400));
  }
  
  // Check stock availability
  for (const item of cart.items) {
    if (item.quantity > item.product.stock) {
      return next(new AppError(`Stok produk ${item.product.name} tidak mencukupi`, 400));
    }
  }
  
  // Calculate order details
  const orderItems = cart.items.map(item => ({
    product: item.product._id,
    name: item.product.name,
    quantity: item.quantity,
    image: item.product.images[0] || '',
    price: item.product.price,
    discountPercentage: item.product.discountPercentage || 0
  }));
  
  // Calculate totals
  const itemsPrice = cart.items.reduce((acc, item) => {
    const discountedPrice = item.product.discountPercentage 
      ? item.product.price * (1 - item.product.discountPercentage / 100) 
      : item.product.price;
    return acc + discountedPrice * item.quantity;
  }, 0);
  
  // Calculate shipping cost based on weight and shipping method
  const totalWeight = cart.items.reduce((acc, item) => {
    return acc + (item.product.weight || 500) * item.quantity;
  }, 0);
  
  let shippingPrice = 0;
  if (shippingMethod === 'regular') {
    shippingPrice = totalWeight < 1000 ? 10000 : Math.ceil(totalWeight / 1000) * 10000;
  } else if (shippingMethod === 'express') {
    shippingPrice = totalWeight < 1000 ? 20000 : Math.ceil(totalWeight / 1000) * 20000;
  }
  
  // Apply tax
  const taxRate = 0.11; // 11% tax
  const taxPrice = itemsPrice * taxRate;
  
  // Calculate total
  const totalPrice = itemsPrice + shippingPrice + taxPrice;
  
  // Create order
  const order = await Order.create({
    user: req.user.id,
    orderItems,
    shippingAddress,
    paymentMethod,
    shippingMethod,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
    notes,
    orderId: generateOrderId(),
    status: 'pending',
    paymentStatus: 'pending'
  });
  
  // Update product stock
  for (const item of cart.items) {
    await Product.findByIdAndUpdate(item.product._id, {
      $inc: { stock: -item.quantity }
    });
  }
  
  // Clear cart
  await Cart.findOneAndUpdate(
    { user: req.user.id },
    { $set: { items: [] } }
  );
  
  // Invalidate cache
  if (redisClient.connected) {
    redisClient.del(`user:${req.user.id}:orders`);
    redisClient.del('orders:*');
  }
  
  // Send order confirmation email
  try {
    await sendOrderConfirmationEmail(req.user.email, order);
  } catch (err) {
    logger.error('Email sending error:', err);
    // Continue even if email fails
  }
  
  res.status(201).json({
    status: 'success',
    data: {
      order
    }
  });
});

/**
 * @desc    Get all orders
 * @route   GET /api/v1/orders
 * @access  Private
 */
exports.getAllOrders = cacheMiddleware('user_orders', 300)(catchAsync(async (req, res, next) => {
  const orders = await Order.find({ user: req.user.id })
    .sort('-createdAt')
    .populate('user', 'name email');
  
  res.status(200).json({
    status: 'success',
    results: orders.length,
    data: {
      orders
    }
  });
}));

/**
 * @desc    Get order by ID
 * @route   GET /api/v1/orders/:id
 * @access  Private
 */
exports.getOrderById = catchAsync(async (req, res, next) => {
  const order = await Order.findById(req.params.id)
    .populate('user', 'name email')
    .populate({
      path: 'orderItems.product',
      select: 'name images'
    });
  
  if (!order) {
    return next(new AppError('Pesanan tidak ditemukan', 404));
  }
  
  // Check if order belongs to user or user is admin
  if (order.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new AppError('Anda tidak memiliki akses ke pesanan ini', 403));
  }
  
  res.status(200).json({
    status: 'success',
    data: {
      order
    }
  });
});

/**
 * @desc    Update order to paid
 * @route   PATCH /api/v1/orders/:id/pay
 * @access  Private
 */
exports.updateOrderToPaid = catchAsync(async (req, res, next) => {
  const { paymentResult } = req.body;
  
  if (!paymentResult) {
    return next(new AppError('Informasi pembayaran diperlukan', 400));
  }
  
  const order = await Order.findById(req.params.id);
  
  if (!order) {
    return next(new AppError('Pesanan tidak ditemukan', 404));
  }
  
  if (order.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new AppError('Anda tidak memiliki akses ke pesanan ini', 403));
  }
  
  if (order.paymentStatus === 'paid') {
    return next(new AppError('Pesanan ini sudah dibayar', 400));
  }
  
  order.paymentStatus = 'paid';
  order.paymentResult = {
    id: paymentResult.id,
    status: paymentResult.status,
    update_time: paymentResult.update_time,
    email_address: paymentResult.email_address
  };
  order.paidAt = Date.now();
  
  // If payment is confirmed, update order status
  if (order.status === 'pending') {
    order.status = 'processing';
  }
  
  const updatedOrder = await order.save();
  
  // Invalidate cache
  if (redisClient.connected) {
    redisClient.del(`order:${req.params.id}`);
    redisClient.del(`user:${req.user.id}:orders`);
    redisClient.del('orders:*');
  }
  
  res.status(200).json({
    status: 'success',
    data: {
      order: updatedOrder
    }
  });
});

/**
 * @desc    Update order status
 * @route   PATCH /api/v1/orders/:id/status
 * @access  Private/Admin
 */
exports.updateOrderStatus = catchAsync(async (req, res, next) => {
  const { status } = req.body;
  
  if (!status) {
    return next(new AppError('Status pesanan diperlukan', 400));
  }
  
  const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
  if (!validStatuses.includes(status)) {
    return next(new AppError('Status pesanan tidak valid', 400));
  }
  
  const order = await Order.findById(req.params.id);
  
  if (!order) {
    return next(new AppError('Pesanan tidak ditemukan', 404));
  }
  
  // Only admin can update order status
  if (req.user.role !== 'admin') {
    return next(new AppError('Anda tidak memiliki izin untuk mengubah status pesanan', 403));
  }
  
  // If cancelling order, check if it's already shipped
  if (status === 'cancelled' && ['shipped', 'delivered'].includes(order.status)) {
    return next(new AppError('Pesanan yang sudah dikirim atau diterima tidak dapat dibatalkan', 400));
  }
  
  // If order is cancelled, restore product stock
  if (status === 'cancelled' && order.status !== 'cancelled') {
    for (const item of order.orderItems) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: item.quantity }
      });
    }
  }
  
  order.status = status;
  
  // Set delivery date if status is delivered
  if (status === 'delivered') {
    order.deliveredAt = Date.now();
  }
  
  const updatedOrder = await order.save();
  
  // Invalidate cache
  if (redisClient.connected) {
    redisClient.del(`order:${req.params.id}`);
    redisClient.del(`user:${order.user}:orders`);
    redisClient.del('orders:*');
  }
  
  res.status(200).json({
    status: 'success',
    data: {
      order: updatedOrder
    }
  });
});

/**
 * @desc    Cancel order
 * @route   PATCH /api/v1/orders/:id/cancel
 * @access  Private
 */
exports.cancelOrder = catchAsync(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  
  if (!order) {
    return next(new AppError('Pesanan tidak ditemukan', 404));
  }
  
  if (order.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new AppError('Anda tidak memiliki akses ke pesanan ini', 403));
  }
  
  // Check if order can be cancelled
  if (['shipped', 'delivered', 'cancelled'].includes(order.status)) {
    return next(new AppError(`Pesanan dengan status ${order.status} tidak dapat dibatalkan`, 400));
  }
  
  // Restore product stock
  for (const item of order.orderItems) {
    await Product.findByIdAndUpdate(item.product, {
      $inc: { stock: item.quantity }
    });
  }
  
  order.status = 'cancelled';
  order.cancelledAt = Date.now();
  
  const updatedOrder = await order.save();
  
  // Invalidate cache
  if (redisClient.connected) {
    redisClient.del(`order:${req.params.id}`);
    redisClient.del(`user:${req.user.id}:orders`);
    redisClient.del('orders:*');
  }
  
  res.status(200).json({
    status: 'success',
    data: {
      order: updatedOrder
    }
  });
});

/**
 * @desc    Get order statistics
 * @route   GET /api/v1/orders/stats
 * @access  Private/Admin
 */
exports.getOrderStats = catchAsync(async (req, res, next) => {
  if (req.user.role !== 'admin') {
    return next(new AppError('Anda tidak memiliki izin untuk mengakses statistik pesanan', 403));
  }
  
  const stats = await Order.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        totalAmount: { $sum: '$totalPrice' }
      }
    },
    {
      $project: {
        _id: 0,
        status: '$_id',
        count: 1,
        totalAmount: { $round: ['$totalAmount', 2] }
      }
    }
  ]);
  
  const totalOrders = await Order.countDocuments();
  const totalRevenue = await Order.aggregate([
    {
      $match: { paymentStatus: 'paid' }
    },
    {
      $group: {
        _id: null,
        total: { $sum: '$totalPrice' }
      }
    }
  ]);
  
  res.status(200).json({
    status: 'success',
    data: {
      stats,
      totalOrders,
      totalRevenue: totalRevenue.length > 0 ? totalRevenue[0].total : 0
    }
  });
});

/**
 * @desc    Create payment intent with Stripe
 * @route   POST /api/v1/orders/:id/create-payment-intent
 * @access  Private
 */
exports.createPaymentIntent = catchAsync(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  
  if (!order) {
    return next(new AppError('Pesanan tidak ditemukan', 404));
  }
  
  if (order.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new AppError('Anda tidak memiliki akses ke pesanan ini', 403));
  }
  
  if (order.paymentStatus === 'paid') {
    return next(new AppError('Pesanan ini sudah dibayar', 400));
  }
  
  // Create payment intent with Stripe
  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(order.totalPrice * 100), // Stripe requires amount in cents
    currency: 'idr',
    metadata: {
      orderId: order._id.toString(),
      userId: req.user.id
    }
  });
  
  res.status(200).json({
    status: 'success',
    clientSecret: paymentIntent.client_secret
  });
});

/**
 * @desc    Get admin dashboard stats
 * @route   GET /api/v1/orders/admin-stats
 * @access  Private/Admin
 */
exports.getAdminStats = catchAsync(async (req, res, next) => {
  if (req.user.role !== 'admin') {
    return next(new AppError('Anda tidak memiliki izin untuk mengakses statistik admin', 403));
  }
  
  // Get today's date and 30 days ago
  const today = new Date();
  const thirtyDaysAgo = new Date(today);
  thirtyDaysAgo.setDate(today.getDate() - 30);
  
  // Get recent orders
  const recentOrders = await Order.find()
    .sort('-createdAt')
    .limit(10)
    .populate('user', 'name email');
  
  // Get monthly revenue
  const monthlyRevenue = await Order.aggregate([
    {
      $match: {
        createdAt: { $gte: thirtyDaysAgo },
        paymentStatus: 'paid'
      }
    },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        revenue: { $sum: '$totalPrice' },
        orders: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } }
  ]);
  
  // Get order status counts
  const orderStatusCounts = await Order.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    }
  ]);
  
  // Get total customers
  const totalCustomers = await User.countDocuments({ role: 'user' });
  
  // Get top selling products
  const topSellingProducts = await Order.aggregate([
    { $unwind: '$orderItems' },
    {
      $group: {
        _id: '$orderItems.product',
        name: { $first: '$orderItems.name' },
        totalSold: { $sum: '$orderItems.quantity' },
        revenue: { $sum: { $multiply: ['$orderItems.price', '$orderItems.quantity'] } }
      }
    },
    { $sort: { totalSold: -1 } },
    { $limit: 5 }
  ]);
  
  res.status(200).json({
    status: 'success',
    data: {
      recentOrders,
      monthlyRevenue,
      orderStatusCounts,
      totalCustomers,
      topSellingProducts
    }
  });
});

/**
 * @desc    Get user order history
 * @route   GET /api/v1/orders/my-orders
 * @access  Private
 */
exports.getMyOrders = cacheMiddleware('my_orders', 300)(catchAsync(async (req, res, next) => {
  const orders = await Order.find({ user: req.user.id })
    .sort('-createdAt')
    .select('orderId totalPrice status paymentStatus createdAt orderItems');
  
  res.status(200).json({
    status: 'success',
    results: orders.length,
    data: {
      orders
    }
  });
}));

/**
 * @desc    Confirm order delivery
 * @route   PATCH /api/v1/orders/:id/confirm-delivery
 * @access  Private
 */
exports.confirmDelivery = catchAsync(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  
  if (!order) {
    return next(new AppError('Pesanan tidak ditemukan', 404));
  }
  
  if (order.user.toString() !== req.user.id) {
    return next(new AppError('Anda tidak memiliki akses ke pesanan ini', 403));
  }
  
  if (order.status !== 'shipped') {
    return next(new AppError('Hanya pesanan dengan status dikirim yang dapat dikonfirmasi penerimaan', 400));
  }
  
  order.status = 'delivered';
  order.deliveredAt = Date.now();
  
  const updatedOrder = await order.save();
  
  // Invalidate cache
  if (redisClient.connected) {
    redisClient.del(`order:${req.params.id}`);
    redisClient.del(`user:${req.user.id}:orders`);
    redisClient.del('orders:*');
  }
  
  res.status(200).json({
    status: 'success',
    data: {
      order: updatedOrder
    }
  });
});

/**
 * @desc    Get order tracking
 * @route   GET /api/v1/orders/:id/tracking
 * @access  Private
 */
exports.getOrderTracking = catchAsync(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  
  if (!order) {
    return next(new AppError('Pesanan tidak ditemukan', 404));
  }
  
  if (order.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new AppError('Anda tidak memiliki akses ke pesanan ini', 403));
  }
  
  // Generate tracking timeline
  const timeline = [
    {
      status: 'pending',
      date: order.createdAt,
      description: 'Pesanan dibuat'
    }
  ];
  
  if (order.paymentStatus === 'paid') {
    timeline.push({
      status: 'paid',
      date: order.paidAt,
      description: 'Pembayaran diterima'
    });
  }
  
  if (order.status === 'processing' || ['shipped', 'delivered'].includes(order.status)) {
    timeline.push({
      status: 'processing',
      date: order.updatedAt,
      description: 'Pesanan sedang diproses'
    });
  }
  
  if (order.status === 'shipped' || order.status === 'delivered') {
    timeline.push({
      status: 'shipped',
      date: order.shippedAt || order.updatedAt,
      description: 'Pesanan dikirim'
    });
  }
  
  if (order.status === 'delivered') {
    timeline.push({
      status: 'delivered',
      date: order.deliveredAt,
      description: 'Pesanan diterima'
    });
  }
  
  if (order.status === 'cancelled') {
    timeline.push({
      status: 'cancelled',
      date: order.cancelledAt || order.updatedAt,
      description: 'Pesanan dibatalkan'
    });
  }
  
  res.status(200).json({
    status: 'success',
    data: {
      orderId: order.orderId,
      currentStatus: order.status,
      timeline
    }
  });
});