const Product = require('../models/Product');
const APIFeatures = require('../utils/apiFeatures');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const slugify = require('slugify');
const { v4: uuidv4 } = require('uuid');
const logger = require('../utils/logger');
const fs = require('fs').promises;
const path = require('path');
const sharp = require('sharp');
const { promisify } = require('util');
const {
  ALLOWED_CATEGORIES,
  validateCategory,
  generateSKU,
  generateProductId,
  generateRating,
  generateWeight,
  generateProductVariants,
  calculateDiscountPrice
} = require('../utils/productHelpers');

// Redis configuration with fallback
let redisClient;
try {
  redisClient = require('../utils/redis');
} catch (err) {
  redisClient = {
    connected: false,
    get: () => Promise.resolve(null),
    set: () => Promise.resolve(),
    del: () => Promise.resolve(),
    on: () => {}
  };
  logger.info('Redis module not found, continuing without Redis caching');
}

// Promisify Redis methods if available
const getAsync = redisClient.connected ? promisify(redisClient.get).bind(redisClient) : () => Promise.resolve(null);
const setAsync = redisClient.connected ? promisify(redisClient.set).bind(redisClient) : () => Promise.resolve();

// Cache middleware
const cacheMiddleware = (key, ttl = 3600) => {
  return function(handler) {
    return catchAsync(async (req, res, next) => {
      // Skip caching if Redis is not available
      if (!redisClient || !redisClient.connected) {
        return handler(req, res, next);
      }
      
      const cacheKey = `${key}:${req.originalUrl}`;
      const cachedData = await getAsync(cacheKey);
      
      if (cachedData) {
        logger.info(`Serving from cache: ${cacheKey}`);
        return res.status(200).json(JSON.parse(cachedData));
      }
      
      res.sendResponse = res.json;
      res.json = (body) => {
        if (redisClient && redisClient.connected) {
          setAsync(cacheKey, JSON.stringify(body), 'EX', ttl)
            .catch(err => logger.error('Redis set error:', err));
        }
        return res.sendResponse(body);
      };
      
      return handler(req, res, next);
    });
  };
};

// Image processing
const processProductImages = async (images, productId) => {
  const processedImages = [];
  const uploadPath = path.join(__dirname, '../public/uploads/products', productId);
  
  try {
    await fs.mkdir(uploadPath, { recursive: true });
    
    for (const [index, image] of images.entries()) {
      const filename = `product-${productId}-${Date.now()}-${index}.webp`;
      const filepath = path.join(uploadPath, filename);
      
      await sharp(image.buffer)
        .resize(800, 800, { fit: 'inside', withoutEnlargement: true })
        .webp({ quality: 85 })
        .toFile(filepath);
      
      processedImages.push(`/uploads/products/${productId}/${filename}`);
    }
    
    return processedImages;
  } catch (err) {
    logger.error('Image processing error:', err);
    throw new AppError('Error processing product images', 500);
  }
};

/**
 * @desc    Get all products with advanced filtering
 * @route   GET /api/v1/products
 * @access  Public
 */
exports.getAllProducts = cacheMiddleware('products', 300)(catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Product.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .search()  // Pindahkan search sebelum paginate
    .paginate();
  
  const products = await features.query;
  const total = await Product.countDocuments(features.filterQuery);

  res.status(200).json({
    status: 'success',
    results: products.length,
    total,
    page: features.page,
    pages: Math.ceil(total / features.limit),
    data: {
      products
    }
  });
}));

/**
 * @desc    Get single product with caching
 * @route   GET /api/v1/products/:id
 * @access  Public
 */
exports.getProduct = cacheMiddleware('product', 600)(catchAsync(async (req, res, next) => {
  const product = await Product.findById(req.params.id)
    .populate('reviews')
    .populate('relatedProducts');

  if (!product) {
    return next(new AppError('No product found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      product
    }
  });
}));

/**
 * @desc    Create new product with validation
 * @route   POST /api/v1/products
 * @access  Private/Admin
 */
exports.createProduct = catchAsync(async (req, res, next) => {
  const { name, category, price } = req.body;
  
  if (!name || !category || !price) {
    return next(new AppError('Name, category and price are required fields', 400));
  }

  validateCategory(category);

  let images = [];
  if (req.files?.images) {
    images = await processProductImages(
      Array.isArray(req.files.images) ? req.files.images : [req.files.images],
      uuidv4()
    );
  }

  const newProduct = await Product.create({
    ...req.body,
    images,
    sku: generateSKU(category),
    productId: generateProductId(category),
    ratings: generateRating(),
    weight: generateWeight(800, 1000),
    variants: generateProductVariants({ ...req.body, sku: generateSKU(category) }),
    slug: slugify(name, { lower: true, strict: true }),
    createdBy: req.user?.id,
    discountPrice: req.body.discountPercentage 
      ? calculateDiscountPrice(price, req.body.discountPercentage)
      : null
  });

  if (redisClient.connected) {
    redisClient.del('products:*').catch(err => logger.error('Cache invalidation error:', err));
  }

  res.status(201).json({
    status: 'success',
    data: {
      product: newProduct
    }
  });
});

/**
 * @desc    Update product with proper validation
 * @route   PATCH /api/v1/products/:id
 * @access  Private/Admin
 */
exports.updateProduct = catchAsync(async (req, res, next) => {
  const filteredBody = { ...req.body };
  const disallowedFields = ['_id', 'sku', 'productId', 'createdAt', 'createdBy', 'ratings'];
  disallowedFields.forEach(field => delete filteredBody[field]);

  if (filteredBody.category) {
    validateCategory(filteredBody.category);
  }

  if (req.files?.images) {
    const images = await processProductImages(
      Array.isArray(req.files.images) ? req.files.images : [req.files.images],
      req.params.id
    );
    filteredBody.images = [...(req.body.images || []), ...images];
  }

  if (filteredBody.name) {
    filteredBody.slug = slugify(filteredBody.name, { lower: true, strict: true });
  }

  if (filteredBody.price || filteredBody.discountPercentage) {
    const product = await Product.findById(req.params.id);
    const currentPrice = filteredBody.price || product.price;
    const currentDiscount = filteredBody.discountPercentage || product.discountPercentage;
    
    filteredBody.discountPrice = currentDiscount > 0 
      ? calculateDiscountPrice(currentPrice, currentDiscount)
      : null;
  }

  const updatedProduct = await Product.findByIdAndUpdate(
    req.params.id,
    filteredBody,
    { new: true, runValidators: true, context: 'query' }
  );

  if (!updatedProduct) {
    return next(new AppError('No product found with that ID', 404));
  }

  if (redisClient.connected) {
    redisClient.del(`product:${req.params.id}`).catch(err => logger.error('Cache invalidation error:', err));
    redisClient.del('products:*').catch(err => logger.error('Cache invalidation error:', err));
  }

  res.status(200).json({
    status: 'success',
    data: {
      product: updatedProduct
    }
  });
});

/**
 * @desc    Delete product with cache invalidation
 * @route   DELETE /api/v1/products/:id
 * @access  Private/Admin
 */
exports.deleteProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findByIdAndDelete(req.params.id);

  if (!product) {
    return next(new AppError('No product found with that ID', 404));
  }

  try {
    const uploadPath = path.join(__dirname, '../public/uploads/products', req.params.id);
    await fs.rm(uploadPath, { recursive: true, force: true });
  } catch (err) {
    logger.error('Error deleting product images:', err);
  }

  if (redisClient.connected) {
    redisClient.del(`product:${req.params.id}`).catch(err => logger.error('Cache invalidation error:', err));
    redisClient.del('products:*').catch(err => logger.error('Cache invalidation error:', err));
  }

  res.status(204).json({
    status: 'success',
    data: null
  });
});

/**
 * @desc    Get products by category
 * @route   GET /api/v1/products/category/:category
 * @access  Public
 */
exports.getProductsByCategory = cacheMiddleware('products_by_category', 600)(catchAsync(async (req, res, next) => {
  const { category } = req.params;
  validateCategory(category);

  const features = new APIFeatures(
    Product.find({ category }), 
    req.query
  )
    .sort()
    .paginate();

  const products = await features.query;
  const total = await Product.countDocuments({ category });

  if (products.length === 0) {
    return next(new AppError('No products found in this category', 404));
  }

  res.status(200).json({
    status: 'success',
    results: products.length,
    total,
    page: features.page,
    pages: Math.ceil(total / features.limit),
    data: {
      products
    }
  });
}));


/**
 * @desc    Get category statistics
 * @route   GET /api/v1/products/categories/stats
 * @access  Public
 */
exports.getCategoryStats = catchAsync(async (req, res, next) => {
  const stats = await Product.aggregate([
    { 
      $match: { 
        category: { $in: ALLOWED_CATEGORIES } 
      } 
    },
    {
      $group: {
        _id: '$category',
        count: { $sum: 1 },
        avgPrice: { $avg: '$price' },
        avgRating: { $avg: '$ratings.average' },
        totalStock: { $sum: '$stock' }
      }
    },
    { $sort: { count: -1 } }
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      stats
    }
  });
});

/**
 * @desc    Get featured products
 * @route   GET /api/v1/products/featured
 * @access  Public
 */
exports.getFeaturedProducts = cacheMiddleware('featured_products', 3600)(catchAsync(async (req, res, next) => {
  const products = await Product.find({ isFeatured: true })
    .sort('-createdAt')
    .limit(8)
    .select('name price images slug ratings');

  res.status(200).json({
    status: 'success',
    results: products.length,
    data: {
      products
    }
  });
}));

/**
 * @desc    Get new arrivals
 * @route   GET /api/v1/products/new-arrivals
 * @access  Public
 */
exports.getNewArrivals = cacheMiddleware('new_arrivals', 3600)(catchAsync(async (req, res, next) => {
  const products = await Product.find({ isNewArrival: true })
    .sort('-createdAt')
    .limit(8)
    .select('name price images slug ratings');

  res.status(200).json({
    status: 'success',
    results: products.length,
    data: {
      products
    }
  });
}));

/**
 * @desc    Update product stock
 * @route   PATCH /api/v1/products/:id/stock
 * @access  Private/Admin
 */
exports.updateProductStock = catchAsync(async (req, res, next) => {
  const { quantity } = req.body;

  if (!quantity || typeof quantity !== 'number') {
    return next(new AppError('Please provide a valid quantity', 400));
  }

  const product = await Product.findById(req.params.id);
  
  if (!product) {
    return next(new AppError('No product found with that ID', 404));
  }

  if (product.stock + quantity < 0) {
    return next(new AppError(`Not enough stock. Only ${product.stock} available`, 400));
  }

  const updatedProduct = await Product.findByIdAndUpdate(
    req.params.id,
    { $inc: { stock: quantity } },
    { new: true, runValidators: true }
  );

  if (redisClient.connected) {
    redisClient.del(`product:${req.params.id}`).catch(err => logger.error('Cache invalidation error:', err));
    redisClient.del('products:*').catch(err => logger.error('Cache invalidation error:', err));
  }

  res.status(200).json({
    status: 'success',
    data: {
      product: updatedProduct
    }
  });
});

/**
 * @desc    Get similar products
 * @route   GET /api/v1/products/:id/similar
 * @access  Public
 */
exports.getSimilarProducts = cacheMiddleware('similar_products', 3600)(catchAsync(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  
  if (!product) {
    return next(new AppError('No product found with that ID', 404));
  }

  const similarProducts = await Product.find({
    category: product.category,
    _id: { $ne: product._id }
  })
  .limit(4)
  .select('name price images slug ratings');

  res.status(200).json({
    status: 'success',
    results: similarProducts.length,
    data: {
      products: similarProducts
    }
  });
}));

/**
 * @desc    Get products on sale
 * @route   GET /api/v1/products/on-sale
 * @access  Public
 */
exports.getProductsOnSale = cacheMiddleware('on_sale', 3600)(catchAsync(async (req, res, next) => {
  const products = await Product.find({ discountPercentage: { $gt: 0 } })
    .sort('-discountPercentage')
    .limit(8)
    .select('name price discountPercentage images slug ratings');

  res.status(200).json({
    status: 'success',
    results: products.length,
    data: {
      products
    }
  });
}));

// Make sure all your controller functions have the next parameter
// For example:

// Change this:
exports.someFunction = catchAsync(async (req, res) => {
  // function body
});

// To this:
exports.someFunction = catchAsync(async (req, res, next) => {
  // function body
});

// Error ini terjadi karena ada metode `search()` yang dipanggil setelah rangkaian metode lain (`filter`, `sort`, `limitFields`, `paginate`), tetapi metode `search` tidak tersedia atau tidak didefinisikan dengan benar dalam rantai metode tersebut.

/* 
Untuk memperbaiki masalah ini, kita perlu mengubah urutan pemanggilan metode di `productController.js`. Metode `search` seharusnya dipanggil sebelum metode `paginate` atau mungkin perlu didefinisikan terlebih dahulu.
*/

/* 
Berikut adalah langkah-langkah untuk memperbaiki error:

Ubah dari:
const products = await features.filter().sort().limitFields().paginate().search();

Menjadi:
const products = await features.filter().sort().limitFields().search().paginate();
*/

// ... existing code ...