import express from 'express';
import * as productController from '../controllers/productController.js';
import authenticate from '../middleware/auth.js';
import Product from '../models/Product.js';

// Import data produk dari file terpisah
import {
  allProducts,
  // Import fungsi helper jika diperlukan
  generateWeight,
  generateDimensions,
  slugifyText,
  generateProductId,
  generateSKU,
  generateRating,
  enhanceProductData
} from '../utils/productData.js';

const router = express.Router();

// GET /api/products - Get all products
router.get('/', (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 200;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedProducts = allProducts.slice(startIndex, endIndex);
    res.status(200).json({
      status: 'success',
      results: paginatedProducts.length,
      total: allProducts.length,
      totalPages: Math.ceil(allProducts.length / limit),
      currentPage: page,
      data: {
        products: paginatedProducts
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// GET /api/products/featured
router.get('/featured', (req, res) => {
  try {
    const featuredProducts = allProducts.filter(p => p.isFeatured);
    const limit = parseInt(req.query.limit) || 8;
    
    res.json({
      status: 'success',
      results: featuredProducts.length,
      data: {
        products: featuredProducts.slice(0, limit)
      }
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message
    });
  }
});

// GET /api/products/new-arrivals
router.get('/new-arrivals', (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 24;
    const newArrivals = allProducts
      .filter(p => p.isNewRelease)
      .sort((a, b) => b.rating.average - a.rating.average)
      .slice(0, limit);
    
    res.json({
      status: 'success',
      results: newArrivals.length,
      data: {
        products: newArrivals
      }
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message
    });
  }
});

// GET /api/products/category/:category
router.get('/category/:category', (req, res) => {
  try {
    const categoryProducts = allProducts.filter(
      p => p.category.toLowerCase() === req.params.category.toLowerCase()
    );
    
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    
    res.json({
      status: 'success',
      results: categoryProducts.length,
      totalPages: Math.ceil(categoryProducts.length / limit),
      currentPage: page,
      data: {
        products: categoryProducts.slice(startIndex, endIndex)
      }
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message
    });
  }
});

// GET /api/products/best-sellers
router.get('/best-sellers', (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 24;
    const bestSellers = allProducts
      .filter(p => p.isBestSeller)
      .sort((a, b) => b.rating.average - a.rating.average)
      .slice(0, limit);
    
    res.json({
      status: 'success',
      results: bestSellers.length,
      data: {
        products: bestSellers
      }
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message
    });
  }
});

// GET /api/products/search - Search products (must be before /:id route)
router.get('/search', (req, res) => {
  try {
    // Parse query parameters with fallback for middleware conflicts
    let query;
    if (typeof req.query === 'object' && req.query.q) {
      query = req.query.q;
    } else {
      // Fallback: parse from URL if req.query is corrupted by middleware
      const urlObj = new URL(req.originalUrl, `http://localhost:${process.env.PORT || 5000}`);
      query = urlObj.searchParams.get('q');
    }
    
    if (!query || query.trim() === '') {
      return res.status(400).json({
        status: 'error',
        message: 'Search query is required'
      });
    }

    // Search in static data
    const searchQuery = query.toLowerCase();
    const searchResults = allProducts.filter(product => {
      return (
        product.name.toLowerCase().includes(searchQuery) ||
        product.description.toLowerCase().includes(searchQuery) ||
        product.brand.toLowerCase().includes(searchQuery) ||
        product.category.toLowerCase().includes(searchQuery)
      );
    });

    // Limit results to 10 for dropdown
    const limit = parseInt(req.query.limit) || 10;
    const limitedResults = searchResults.slice(0, limit);

    res.status(200).json({
      status: 'success',
      results: limitedResults.length,
      total: searchResults.length,
      data: {
        products: limitedResults
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// GET /api/products/:id - Get single product by ID or slug
router.get('/:id', (req, res) => {
  try {
    let product = allProducts.find(p => 
      p.id === req.params.id || 
      p.slug === req.params.id ||
      p._id === req.params.id
    );
    if (!product) {
      return res.status(404).json({
        status: 'error',
        message: 'Product not found'
      });
    }
    res.status(200).json({
      status: 'success',
      data: {
        product
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// POST /api/products - Create new product (admin only)
router.post('/', authenticate, productController.createProduct);

// PUT /api/products/:id - Update product (admin only)
router.put('/:id', authenticate, productController.updateProduct);

// DELETE /api/products/:id - Delete product (admin only)
router.delete('/:id', authenticate, productController.deleteProduct);

export default router;