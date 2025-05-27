const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { authenticate } = require('../middleware/auth');

// Import data produk dari file terpisah
const {
  allProducts,
  // Import fungsi helper jika diperlukan
  generateWeight,
  generateDimensions,
  slugify,
  generateProductId,
  generateSKU,
  generateRating,
  enhanceProductData
} = require('../utils/productData');

// GET /api/products - Get all products (no limit)
router.get('/', productController.getAllProducts);

// GET /api/products/best-sellers - Get best selling products
router.get('/best-sellers', (req, res) => {
  try {
    const bestSellers = allProducts.filter(p => p.isBestSeller);
    
    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 32;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    
    const paginatedProducts = bestSellers.slice(startIndex, endIndex);
    
    res.status(200).json({
      status: 'success',
      results: bestSellers.length,
      totalPages: Math.ceil(bestSellers.length / limit),
      currentPage: page,
      data: {
        products: paginatedProducts
      }
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message
    });
  }
});

// GET /api/products/best-seller - Alternative route for best selling products
router.get('/best-seller', (req, res) => {
  try {
    const bestSellers = allProducts.filter(p => p.isBestSeller);
    
    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 32;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    
    const paginatedProducts = bestSellers.slice(startIndex, endIndex);
    
    res.status(200).json({
      status: 'success',
      results: bestSellers.length,
      totalPages: Math.ceil(bestSellers.length / limit),
      currentPage: page,
      data: {
        products: paginatedProducts
      }
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message
    });
  }
});

// GET /api/products/new-arrivals - Get new arrivals
router.get('/new-arrivals', (req, res) => {
  try {
    const newArrivals = allProducts.filter(p => p.isNewRelease);
    
    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 24;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    
    const paginatedProducts = newArrivals.slice(startIndex, endIndex);
    
    res.status(200).json({
      status: 'success',
      results: newArrivals.length,
      totalPages: Math.ceil(newArrivals.length / limit),
      currentPage: page,
      data: {
        products: paginatedProducts
      }
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message
    });
  }
});

// GET /api/products/featured - Get featured products
router.get('/featured', (req, res) => {
  try {
    const featuredProducts = allProducts.filter(p => p.isFeatured);
    
    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    
    const paginatedProducts = featuredProducts.slice(startIndex, endIndex);
    
    res.status(200).json({
      status: 'success',
      results: featuredProducts.length,
      totalPages: Math.ceil(featuredProducts.length / limit),
      currentPage: page,
      data: {
        products: paginatedProducts
      }
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message
    });
  }
});

// GET /api/products/category/:category - Get products by category
router.get('/category/:category', (req, res) => {
  try {
    const categoryProducts = allProducts.filter(
      p => p.category.toLowerCase() === req.params.category.toLowerCase()
    );
    
    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    
    const paginatedProducts = categoryProducts.slice(startIndex, endIndex);
    
    res.status(200).json({
      status: 'success',
      results: categoryProducts.length,
      totalPages: Math.ceil(categoryProducts.length / limit),
      currentPage: page,
      data: {
        products: paginatedProducts
      }
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message
    });
  }
});

// GET /api/products/brand/:brand - Get products by brand
router.get('/brand/:brand', (req, res) => {
  try {
    const brandProducts = allProducts.filter(
      p => p.brand.toLowerCase() === req.params.brand.toLowerCase()
    );
    
    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    
    const paginatedProducts = brandProducts.slice(startIndex, endIndex);
    
    res.status(200).json({
      status: 'success',
      results: brandProducts.length,
      totalPages: Math.ceil(brandProducts.length / limit),
      currentPage: page,
      data: {
        products: paginatedProducts
      }
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message
    });
  }
});

// POST /api/products - Create new product (admin only)
router.post('/', authenticate, productController.createProduct);

// PUT /api/products/:id - Update product (admin only)
router.put('/:id', authenticate, productController.updateProduct);

// DELETE /api/products/:id - Delete product (admin only)
router.delete('/:id', authenticate, productController.deleteProduct);

// PENTING: Export router harus menjadi baris terakhir dalam file
module.exports = router;

// Di dalam file routes/products.js, tambahkan:
const categoriesRouter = require('./categories');
router.use('/categories', categoriesRouter);