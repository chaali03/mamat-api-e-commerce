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

// Import helper functions and product data from utils/productData.js
const {
  generateWeight,
  generateDimensions,
  slugify: slugifyHelper,
  generateProductId,
  generateSKU,
  generateRating,
  ALLOWED_CATEGORIES,
  ALLOWED_BRANDS,
  enhanceProductData,
  mechanicalKeyboards,
  membraneKeyboards,
  opticalKeyboards,
  magneticKeyboards,
  gamingMice,
  officeMice,
  ergonomicMice,
  hardMousepads,
  softMousepads,
  gamingHeadsets,
  musicHeadsets,
  noiseCancellingHeadsets,
  linearSwitches,
  tactileSwitches,
  clickySwitches,
  silentSwitches,
  allProducts
} = require('../utils/productData'); // Pastikan path import benar

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
 * @desc    Get all products with advanced filtering, sorting, and pagination
 * @route   GET /api/products
 * @access  Public
 */
exports.getAllProducts = cacheMiddleware('products')(async (req, res, next) => {
  try {
    // Log query parameters untuk debugging
    console.log('Search query parameters:', req.query);
    
    // Gunakan APIFeatures untuk query MongoDB
    const features = new APIFeatures(Product.find(), req.query)
      .filter()
      .search() // Tambahkan metode search() di sini
      .sort()
      .limitFields()
      .paginate();
    
    const products = await features.query;
    
    // Send response
    res.status(200).json({
      status: 'success',
      results: products.length,
      data: {
        products
      }
    });
  } catch (err) {
    next(new AppError(err.message, 500));
  }
});

/**
 * @desc    Get single product
 * @route   GET /api/products/:id
 * @access  Public
 */
exports.getProduct = cacheMiddleware('product')(async (req, res, next) => {
  try {
    const product = allProducts.find(p => 
      p.productId === req.params.id || 
      p.slug === req.params.id);
    
    if (!product) {
      return next(new AppError('Product not found', 404));
    }
    
    // Get related products (same category)
    const relatedProducts = allProducts
      .filter(p => 
        p.category === product.category && 
        p.productId !== product.productId)
      .slice(0, 4);
    
    res.status(200).json({
      status: 'success',
      data: {
        product,
        relatedProducts
      }
    });
  } catch (err) {
    next(new AppError(err.message, 500));
  }
});

/**
 * @desc    Get products by category
 * @route   GET /api/products/category/:category
 * @access  Public
 */
exports.getProductsByCategory = cacheMiddleware('products_category')(async (req, res, next) => {
  try {
    const category = req.params.category.toLowerCase();
    
    if (!ALLOWED_CATEGORIES.map(c => c.toLowerCase()).includes(category)) {
      return next(new AppError('Invalid product category', 400));
    }
    
    const categoryProducts = allProducts.filter(
      p => p.category.toLowerCase() === category
    );
    
    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    
    const total = categoryProducts.length;
    const totalPages = Math.ceil(total / limit);
    
    if (page > totalPages && totalPages > 0) {
      return next(new AppError('This page does not exist', 404));
    }
    
    const paginatedProducts = categoryProducts.slice(startIndex, endIndex);
    
    // Get subcategories for this category
    const subcategories = [...new Set(
      categoryProducts
        .map(p => p.subCategory)
        .filter(sub => sub !== undefined)
    )];
    
    res.status(200).json({
      status: 'success',
      results: total,
      totalPages,
      currentPage: page,
      category: req.params.category,
      subcategories,
      data: {
        products: paginatedProducts
      }
    });
  } catch (err) {
    next(new AppError(err.message, 500));
  }
});

/**
 * @desc    Get products by subcategory
 * @route   GET /api/products/category/:category/:subcategory
 * @access  Public
 */
exports.getProductsBySubcategory = cacheMiddleware('products_subcategory')(async (req, res, next) => {
  try {
    const category = req.params.category.toLowerCase();
    const subcategory = req.params.subcategory.toLowerCase();
    
    const categoryProducts = allProducts.filter(
      p => p.category.toLowerCase() === category && 
           p.subCategory && 
           p.subCategory.toLowerCase() === subcategory
    );
    
    if (categoryProducts.length === 0) {
      return next(new AppError('No products found in this subcategory', 404));
    }
    
    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    
    const total = categoryProducts.length;
    const totalPages = Math.ceil(total / limit);
    
    if (page > totalPages && totalPages > 0) {
      return next(new AppError('This page does not exist', 404));
    }
    
    const paginatedProducts = categoryProducts.slice(startIndex, endIndex);
    
    res.status(200).json({
      status: 'success',
      results: total,
      totalPages,
      currentPage: page,
      category: req.params.category,
      subcategory: req.params.subcategory,
      data: {
        products: paginatedProducts
      }
    });
  } catch (err) {
    next(new AppError(err.message, 500));
  }
});

/**
 * @desc    Get products by brand
 * @route   GET /api/products/brand/:brand
 * @access  Public
 */
exports.getProductsByBrand = cacheMiddleware('products_brand')(async (req, res, next) => {
  try {
    const brand = req.params.brand.toLowerCase();
    
    if (!ALLOWED_BRANDS.map(b => b.toLowerCase()).includes(brand)) {
      return next(new AppError('Invalid brand', 400));
    }
    
    const brandProducts = allProducts.filter(
      p => p.brand.toLowerCase() === brand
    );
    
    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    
    const total = brandProducts.length;
    const totalPages = Math.ceil(total / limit);
    
    if (page > totalPages && totalPages > 0) {
      return next(new AppError('This page does not exist', 404));
    }
    
    const paginatedProducts = brandProducts.slice(startIndex, endIndex);
    
    res.status(200).json({
      status: 'success',
      results: total,
      totalPages,
      currentPage: page,
      brand: req.params.brand,
      data: {
        products: paginatedProducts
      }
    });
  } catch (err) {
    next(new AppError(err.message, 500));
  }
});

/**
 * @desc    Get featured products
 * @route   GET /api/products/featured
 * @access  Public
 */
exports.getFeaturedProducts = cacheMiddleware('featured_products')(async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 8;
    
    const featuredProducts = allProducts
      .filter(p => p.isFeatured)
      .sort(() => 0.5 - Math.random()) // Randomize order
      .slice(0, limit);
    
    res.status(200).json({
      status: 'success',
      results: featuredProducts.length,
      data: {
        products: featuredProducts
      }
    });
  } catch (err) {
    next(new AppError(err.message, 500));
  }
});

/**
 * @desc    Get new arrivals
 * @route   GET /api/products/new-arrivals
 * @access  Public
 */
exports.getNewArrivals = cacheMiddleware('new_arrivals')(async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 8;
    
    const newProducts = allProducts
      .filter(p => p.isNewRelease)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, limit);
    
    res.status(200).json({
      status: 'success',
      results: newProducts.length,
      data: {
        products: newProducts
      }
    });
  } catch (err) {
    next(new AppError(err.message, 500));
  }
});

/**
 * @desc    Get best selling products
 * @route   GET /api/products/best-sellers
 * @access  Public
 */
exports.getBestSellers = cacheMiddleware('best_sellers')(async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 8;
    
    const bestSellers = allProducts
      .filter(p => p.isBestSeller)
      .sort((a, b) => (b.sold || 0) - (a.sold || 0))
      .slice(0, limit);
    
    res.status(200).json({
      status: 'success',
      results: bestSellers.length,
      data: {
        products: bestSellers
      }
    });
  } catch (err) {
    next(new AppError(err.message, 500));
  }
});

/**
 * @desc    Get discounted products
 * @route   GET /api/products/discounted
 * @access  Public
 */
exports.getDiscountedProducts = cacheMiddleware('discounted_products')(async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 8;
    
    const discountedProducts = allProducts
      .filter(p => p.discountPrice && p.discountPrice < p.price)
      .sort((a, b) => {
        const discountA = ((a.price - a.discountPrice) / a.price) * 100;
        const discountB = ((b.price - b.discountPrice) / b.price) * 100;
        return discountB - discountA;
      })
      .slice(0, limit);
    
    res.status(200).json({
      status: 'success',
      results: discountedProducts.length,
      data: {
        products: discountedProducts
      }
    });
  } catch (err) {
    next(new AppError(err.message, 500));
  }
});

/**
 * @desc    Get product categories
 * @route   GET /api/products/categories
 * @access  Public
 */
exports.getProductCategories = cacheMiddleware('product_categories')(async (req, res, next) => {
  try {
    // Get categories with counts
    const categories = ALLOWED_CATEGORIES.map(category => {
      const count = allProducts.filter(p => 
        p.category.toLowerCase() === category.toLowerCase()
      ).length;
      
      return {
        id: category.toLowerCase(),
        name: category,
        count
      };
    });
    
    res.status(200).json({
      status: 'success',
      results: categories.length,
      data: {
        categories
      }
    });
  } catch (err) {
    next(new AppError('Error fetching product categories', 500));
  }
});

/**
 * @desc    Get product brands
 * @route   GET /api/products/brands
 * @access  Public
 */
exports.getProductBrands = cacheMiddleware('product_brands')(async (req, res, next) => {
  try {
    // Get brands with counts
    const brands = ALLOWED_BRANDS.map(brand => {
      const count = allProducts.filter(p => 
        p.brand.toLowerCase() === brand.toLowerCase()
      ).length;
      
      return {
        id: brand.toLowerCase(),
        name: brand,
        count
      };
    });
    
    res.status(200).json({
      status: 'success',
      results: brands.length,
      data: {
        brands
      }
    });
  } catch (err) {
    next(new AppError('Error fetching product brands', 500));
  }
});

/**
 * @desc    Create new product with validation
 * @route   POST /api/products
 * @access  Private/Admin
 */
exports.createProduct = catchAsync(async (req, res, next) => {
  const { name, category, price, brand } = req.body;
  
  // Validate required fields
  if (!name || !category || !price || !brand) {
    return next(new AppError('Name, category, brand and price are required fields', 400));
  }

  // Validate category
  if (!ALLOWED_CATEGORIES.includes(category)) {
    return next(new AppError(`Invalid category. Allowed categories: ${ALLOWED_CATEGORIES.join(', ')}`, 400));
  }

  // Validate brand
  if (!ALLOWED_BRANDS.includes(brand)) {
    return next(new AppError(`Invalid brand. Allowed brands: ${ALLOWED_BRANDS.join(', ')}`, 400));
  }

  // Process images if provided
  let images = [];
  if (req.files?.images) {
    const productId = generateProductId(category);
    images = await processProductImages(
      Array.isArray(req.files.images) ? req.files.images : [req.files.images],
      productId
    );
  }

  // Generate product data
  const productData = {
    ...req.body,
    images,
    sku: generateSKU(category),
    productId: generateProductId(category),
    rating: generateRating(),
    weight: generateWeight(800, 1000),
    dimensions: generateDimensions(),
    slug: slugify(name, { lower: true, strict: true }),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: req.user?.id
  };

  // Enhance the product data with additional details
  const enhancedProduct = enhanceProductData([productData])[0];

  // Save to database
  const newProduct = await Product.create(enhancedProduct);

  // Invalidate cache
  if (redisClient.connected) {
    await redisClient.del('products:*');
    await redisClient.del('product_categories');
    await redisClient.del('product_brands');
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
 * @route   PATCH /api/products/:id
 * @access  Private/Admin
 */
exports.updateProduct = catchAsync(async (req, res, next) => {
  const filteredBody = { ...req.body };
  const disallowedFields = ['_id', 'sku', 'productId', 'createdAt', 'createdBy'];
  disallowedFields.forEach(field => delete filteredBody[field]);

  // Validate category if being updated
  if (filteredBody.category && !ALLOWED_CATEGORIES.includes(filteredBody.category)) {
    return next(new AppError(`Invalid category. Allowed categories: ${ALLOWED_CATEGORIES.join(', ')}`, 400));
  }

  // Validate brand if being updated
  if (filteredBody.brand && !ALLOWED_BRANDS.includes(filteredBody.brand)) {
    return next(new AppError(`Invalid brand. Allowed brands: ${ALLOWED_BRANDS.join(', ')}`, 400));
  }

  // Process new images if provided
  if (req.files?.images) {
    const images = await processProductImages(
      Array.isArray(req.files.images) ? req.files.images : [req.files.images],
      req.params.id
    );
    filteredBody.images = [...(req.body.images || []), ...images];
  }

  // Update slug if name is changed
  if (filteredBody.name) {
    filteredBody.slug = slugify(filteredBody.name, { lower: true, strict: true });
  }

  // Find the product in allProducts array
  const productIndex = allProducts.findIndex(p => 
    p.productId === req.params.id || 
    p.slug === req.params.id
  );

  if (productIndex === -1) {
    return next(new AppError('No product found with that ID', 404));
  }

  // Update the product in the database
  const updatedProduct = await Product.findByIdAndUpdate(
    req.params.id,
    filteredBody,
    { 
      new: true, 
      runValidators: true, 
      context: 'query',
      timestamps: false // We handle timestamps manually
    }
  );

  if (!updatedProduct) {
    return next(new AppError('No product found with that ID in database', 404));
  }

  // Update timestamps
  updatedProduct.updatedAt = new Date().toISOString();
  await updatedProduct.save();

  // Invalidate relevant caches
  if (redisClient.connected) {
    await redisClient.del(`product:${req.params.id}`);
    await redisClient.del('products:*');
    await redisClient.del('featured_products');
    await redisClient.del('new_arrivals');
    await redisClient.del('best_sellers');
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
 * @route   DELETE /api/products/:id
 * @access  Private/Admin
 */
exports.deleteProduct = catchAsync(async (req, res, next) => {
  // Find the product in allProducts array
  const productIndex = allProducts.findIndex(p => 
    p.productId === req.params.id || 
    p.slug === req.params.id
  );

  if (productIndex === -1) {
    return next(new AppError('No product found with that ID', 404));
  }

  // Delete from database
  const product = await Product.findByIdAndDelete(req.params.id);

  if (!product) {
    return next(new AppError('No product found with that ID in database', 404));
  }

  // Delete associated images
  try {
    const uploadPath = path.join(__dirname, '../public/uploads/products', req.params.id);
    await fs.rm(uploadPath, { recursive: true, force: true });
  } catch (err) {
    logger.error('Error deleting product images:', err);
  }

  // Invalidate relevant caches
  if (redisClient.connected) {
    await redisClient.del(`product:${req.params.id}`);
    await redisClient.del('products:*');
    await redisClient.del('product_categories');
    await redisClient.del('product_brands');
    await redisClient.del('featured_products');
    await redisClient.del('new_arrivals');
    await redisClient.del('best_sellers');
  }

  res.status(204).json({
    status: 'success',
    data: null
  });
});

/**
 * @desc    Get product statistics
 * @route   GET /api/products/stats
 * @access  Private/Admin
 */
exports.getProductStats = catchAsync(async (req, res, next) => {
  try {
    // Calculate total number of products
    const totalProducts = allProducts.length;
    
    // Calculate total value of inventory
    const inventoryValue = allProducts.reduce(
      (sum, product) => sum + (product.price * (product.stock || 0)), 
      0
    );
    
    // Count products by category
    const productsByCategory = ALLOWED_CATEGORIES.map(category => {
      const count = allProducts.filter(p => 
        p.category.toLowerCase() === category.toLowerCase()
      ).length;
      
      return {
        category,
        count,
        percentage: Math.round((count / totalProducts) * 100)
      };
    });
    
    // Count products by brand
    const productsByBrand = ALLOWED_BRANDS.map(brand => {
      const count = allProducts.filter(p => 
        p.brand.toLowerCase() === brand.toLowerCase()
      ).length;
      
      return {
        brand,
        count,
        percentage: Math.round((count / totalProducts) * 100)
      };
    });
    
    // Get top selling products
    const topSelling = [...allProducts]
      .sort((a, b) => (b.sold || 0) - (a.sold || 0))
      .slice(0, 5);
    
    // Get most valuable products (price * stock)
    const mostValuable = [...allProducts]
      .sort((a, b) => (b.price * (b.stock || 0)) - (a.price * (a.stock || 0)))
      .slice(0, 5);
    
    res.status(200).json({
      status: 'success',
      data: {
        totalProducts,
        inventoryValue,
        productsByCategory,
        productsByBrand,
        topSelling,
        mostValuable
      }
    });
  } catch (err) {
    next(new AppError('Error calculating product statistics', 500));
  }
});

/**
 * @desc    Get mechanical keyboards
 * @route   GET /api/products/data/mechanical-keyboards
 * @access  Public
 */
exports.getMechanicalKeyboards = cacheMiddleware('mechanical_keyboards')(async (req, res, next) => {
  try {
    res.status(200).json({
      status: 'success',
      results: mechanicalKeyboards.length,
      data: {
        products: enhanceProductData(mechanicalKeyboards)
      }
    });
  } catch (err) {
    next(new AppError(err.message, 500));
  }
});

/**
 * @desc    Get all product data
 * @route   GET /api/products/data/all-products
 * @access  Public
 */
exports.getAllProductData = cacheMiddleware('all_product_data')(async (req, res, next) => {
  try {
    res.status(200).json({
      status: 'success',
      results: allProducts.length,
      data: {
        products: allProducts
      }
    });
  } catch (err) {
    next(new AppError(err.message, 500));
  }
});

/**
 * @desc    Search products with autocomplete suggestions
 * @route   GET /api/products/search/suggestions
 * @access  Public
 */
exports.getSearchSuggestions = cacheMiddleware('search_suggestions')(async (req, res, next) => {
  try {
    const { q, limit = 5 } = req.query;
    
    if (!q || q.length < 2) {
      return res.status(200).json({
        status: 'success',
        results: 0,
        data: {
          suggestions: []
        }
      });
    }
    
    const searchTerm = q.toLowerCase();
    
    // Get matching products
    const matchingProducts = allProducts
      .filter(p => 
        p.name.toLowerCase().includes(searchTerm) ||
        (p.description && p.description.toLowerCase().includes(searchTerm)) ||
        (p.tags && p.tags.some(tag => tag.toLowerCase().includes(searchTerm)))
      )
      .slice(0, limit);
    
    // Get matching categories
    const matchingCategories = ALLOWED_CATEGORIES
      .filter(category => 
        category.toLowerCase().includes(searchTerm)
      )
      .slice(0, limit);
    
    // Get matching brands
    const matchingBrands = ALLOWED_BRANDS
      .filter(brand => 
        brand.toLowerCase().includes(searchTerm)
      )
      .slice(0, limit);
    
    res.status(200).json({
      status: 'success',
      results: matchingProducts.length + matchingCategories.length + matchingBrands.length,
      data: {
        suggestions: {
          products: matchingProducts.map(p => ({
            id: p.productId,
            name: p.name,
            category: p.category,
            image: p.images?.[0]
          })),
          categories: matchingCategories,
          brands: matchingBrands
        }
      }
    });
  } catch (err) {
    next(new AppError('Error generating search suggestions', 500));
  }
});

/**
 * @desc    Get similar products
 * @route   GET /api/products/:id/similar
 * @access  Public
 */
exports.getSimilarProducts = cacheMiddleware('similar_products')(async (req, res, next) => {
  try {
    const product = allProducts.find(p => 
      p.productId === req.params.id || 
      p.slug === req.params.id);
    
    if (!product) {
      return next(new AppError('Product not found', 404));
    }
    
    // Find similar products (same category and subcategory if available)
    let similarProducts = allProducts.filter(p => 
      p.productId !== product.productId &&
      p.category === product.category
    );
    
    if (product.subCategory) {
      similarProducts = similarProducts.filter(p => 
        p.subCategory === product.subCategory
      );
    }
    
    // Limit to 4 products and randomize
    similarProducts = similarProducts
      .sort(() => 0.5 - Math.random())
      .slice(0, 4);
    
    res.status(200).json({
      status: 'success',
      results: similarProducts.length,
      data: {
        products: similarProducts
      }
    });
  } catch (err) {
    next(new AppError('Error finding similar products', 500));
  }
});

/**
 * @desc    Get frequently bought together products
 * @route   GET /api/products/:id/frequently-bought-together
 * @access  Public
 */
exports.getFrequentlyBoughtTogether = cacheMiddleware('frequently_bought_together')(async (req, res, next) => {
  try {
    const product = allProducts.find(p => 
      p.productId === req.params.id || 
      p.slug === req.params.id);
    
    if (!product) {
      return next(new AppError('Product not found', 404));
    }
    
    // This is a simplified version - in a real app you would analyze order history
    // Here we just return complementary products from the same category
    const complementaryProducts = allProducts
      .filter(p => 
        p.productId !== product.productId &&
        p.category === product.category
      )
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);
    
    res.status(200).json({
      status: 'success',
      results: complementaryProducts.length,
      data: {
        products: complementaryProducts
      }
    });
  } catch (err) {
    next(new AppError('Error finding frequently bought together products', 500));
  }
});
