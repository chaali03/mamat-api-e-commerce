const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const Product = require('../models/Product'); // Assuming you have a Product model

// Basic search route
router.get('/', catchAsync(async (req, res) => {
  const { query, category, minPrice, maxPrice, sort } = req.query;
  
  // Build search filter
  const filter = {};
  
  // Add search query if provided
  if (query) {
    filter.$or = [
      { name: { $regex: query, $options: 'i' } },
      { description: { $regex: query, $options: 'i' } }
    ];
  }
  
  // Add category filter if provided
  if (category) {
    filter.category = category;
  }
  
  // Add price range if provided
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }
  
  // Build sort options
  let sortOptions = { createdAt: -1 }; // Default sort by newest
  if (sort) {
    switch (sort) {
      case 'price-asc':
        sortOptions = { price: 1 };
        break;
      case 'price-desc':
        sortOptions = { price: -1 };
        break;
      case 'name-asc':
        sortOptions = { name: 1 };
        break;
      case 'name-desc':
        sortOptions = { name: -1 };
        break;
      case 'rating':
        sortOptions = { averageRating: -1 };
        break;
    }
  }
  
  // Execute search query
  const products = await Product.find(filter)
    .sort(sortOptions)
    .limit(parseInt(req.query.limit) || 20)
    .skip(parseInt(req.query.page) * (parseInt(req.query.limit) || 20) || 0);
  
  // Get total count for pagination
  const total = await Product.countDocuments(filter);
  
  res.status(200).json({
    status: 'success',
    results: products.length,
    total,
    data: {
      products
    }
  });
}));

// Advanced search with filters
router.post('/advanced', catchAsync(async (req, res) => {
  const { query, filters, sort, page = 1, limit = 20 } = req.body;
  
  // Build search filter
  const searchFilter = {};
  
  // Add text search if query provided
  if (query) {
    searchFilter.$or = [
      { name: { $regex: query, $options: 'i' } },
      { description: { $regex: query, $options: 'i' } }
    ];
  }
  
  // Add additional filters
  if (filters) {
    Object.keys(filters).forEach(key => {
      if (Array.isArray(filters[key]) && filters[key].length > 0) {
        searchFilter[key] = { $in: filters[key] };
      } else if (filters[key]) {
        searchFilter[key] = filters[key];
      }
    });
  }
  
  // Build sort options
  let sortOptions = { createdAt: -1 }; // Default sort
  if (sort && sort.field) {
    sortOptions = { [sort.field]: sort.direction === 'desc' ? -1 : 1 };
  }
  
  // Execute search
  const products = await Product.find(searchFilter)
    .sort(sortOptions)
    .limit(parseInt(limit))
    .skip((parseInt(page) - 1) * parseInt(limit));
  
  // Get total count
  const total = await Product.countDocuments(searchFilter);
  
  res.status(200).json({
    status: 'success',
    results: products.length,
    total,
    pages: Math.ceil(total / parseInt(limit)),
    currentPage: parseInt(page),
    data: {
      products
    }
  });
}));

module.exports = router;