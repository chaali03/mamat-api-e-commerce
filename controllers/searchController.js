const Product = require('../models/Product');
const Category = require('../models/Category');
const catchAsync = require('../utils/catchAsync');

exports.searchProducts = catchAsync(async (req, res, next) => {
  const {
    q,
    category,
    minPrice,
    maxPrice,
    rating,
    sort,
    page = 1,
    limit = 12
  } = req.query;
  
  const query = {};
  
  // Search by keyword
  if (q) {
    query.$or = [
      { name: { $regex: q, $options: 'i' } },
      { description: { $regex: q, $options: 'i' } }
    ];
  }
  
  // Filter by category
  if (category) {
    const categoryObj = await Category.findOne({ slug: category });
    if (categoryObj) {
      query.category = categoryObj._id;
    }
  }
  
  // Filter by price range
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
  }
  
  // Filter by rating
  if (rating) {
    query.averageRating = { $gte: Number(rating) };
  }
  
  // Only show products in stock
  query.stock = { $gt: 0 };
  
  // Sorting
  let sortOption = { createdAt: -1 }; // Default: newest first
  
  if (sort === 'price-asc') sortOption = { price: 1 };
  if (sort === 'price-desc') sortOption = { price: -1 };
  if (sort === 'rating-desc') sortOption = { averageRating: -1 };
  if (sort === 'popularity') sortOption = { totalSold: -1 };
  
  // Pagination
  const skip = (Number(page) - 1) * Number(limit);
  
  const products = await Product.find(query)
    .populate('category', 'name slug')
    .sort(sortOption)
    .skip(skip)
    .limit(Number(limit));
    
  // Count total products for pagination
  const total = await Product.countDocuments(query);
  
  // Calculate total pages
  const totalPages = Math.ceil(total / Number(limit));
  
  res.status(200).json({
    status: 'success',
    results: products.length,
    data: {
      products,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages
      }
    }
  });
});