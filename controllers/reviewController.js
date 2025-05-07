const Review = require('../models/Review');
const Product = require('../models/Product');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

// Get all reviews for a product
exports.getProductReviews = catchAsync(async (req, res, next) => {
  const { productId } = req.params;
  
  const reviews = await Review.find({ product: productId })
    .populate({
      path: 'user',
      select: 'name photo'
    })
    .sort('-createdAt');
  
  res.status(200).json({
    status: 'success',
    results: reviews.length,
    data: {
      reviews
    }
  });
});

// Add a review for a product
exports.addReview = catchAsync(async (req, res, next) => {
  const { productId } = req.params;
  const { rating, comment } = req.body;
  
  // Check if product exists
  const product = await Product.findById(productId);
  if (!product) {
    return next(new AppError('Produk tidak ditemukan', 404));
  }
  
  // Check if user already reviewed this product
  const existingReview = await Review.findOne({
    user: req.user.id,
    product: productId
  });
  
  if (existingReview) {
    return next(new AppError('Anda sudah memberikan review untuk produk ini', 400));
  }
  
  // Create review
  const review = await Review.create({
    user: req.user.id,
    product: productId,
    rating,
    comment
  });
  
  // Update product rating
  await product.updateRating();
  
  res.status(201).json({
    status: 'success',
    data: {
      review
    }
  });
});

// Update a review
exports.updateReview = catchAsync(async (req, res, next) => {
  const { reviewId } = req.params;
  const { rating, comment } = req.body;
  
  // Find review
  const review = await Review.findById(reviewId);
  
  if (!review) {
    return next(new AppError('Review tidak ditemukan', 404));
  }
  
  // Check if user is the owner of the review
  if (review.user.toString() !== req.user.id) {
    return next(new AppError('Anda tidak berhak mengubah review ini', 403));
  }
  
  // Update review
  review.rating = rating || review.rating;
  review.comment = comment || review.comment;
  await review.save();
  
  // Update product rating
  const product = await Product.findById(review.product);
  await product.updateRating();
  
  res.status(200).json({
    status: 'success',
    data: {
      review
    }
  });
});

// Delete a review
exports.deleteReview = catchAsync(async (req, res, next) => {
  const { reviewId } = req.params;
  
  // Find review
  const review = await Review.findById(reviewId);
  
  if (!review) {
    return next(new AppError('Review tidak ditemukan', 404));
  }
  
  // Check if user is the owner of the review
  if (review.user.toString() !== req.user.id) {
    return next(new AppError('Anda tidak berhak menghapus review ini', 403));
  }
  
  // Delete review
  await Review.findByIdAndDelete(reviewId);
  
  // Update product rating
  const product = await Product.findById(review.product);
  await product.updateRating();
  
  res.status(204).json({
    status: 'success',
    data: null
  });
});