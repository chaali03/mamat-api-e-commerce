const mongoose = require('mongoose');
// Tambahkan import Product
const Product = require('./Product');

const reviewSchema = new mongoose.Schema({
  review: {
    type: String,
    required: [true, 'Review tidak boleh kosong']
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: [true, 'Rating harus diberikan']
  },
  product: {
    type: mongoose.Schema.ObjectId,
    ref: 'Product',
    required: [true, 'Review harus terkait dengan produk']
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Review harus memiliki penulis']
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Compound index to prevent users from giving more than one review on the same product
reviewSchema.index({ product: 1, user: 1 }, { unique: true });

// Static method to calculate the average rating
reviewSchema.statics.calcAverageRatings = async function(productId) {
  const stats = await this.aggregate([
    {
      $match: { product: productId }
    },
    {
      $group: {
        _id: '$product',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' }
      }
    }
  ]);

  // Use mongoose.model to access Product
  if (stats.length > 0) {
    await mongoose.model('Product').findByIdAndUpdate(productId, {
      'rating.count': stats[0].nRating,
      'rating.average': stats[0].avgRating
    });
  } else {
    await mongoose.model('Product').findByIdAndUpdate(productId, {
      'rating.count': 0,
      'rating.average': 4.5
    });
  }
};

// Middleware to calculate rating after save
reviewSchema.post('save', function() {
  this.constructor.calcAverageRatings(this.product);
});

// Middleware to calculate rating after update or delete
reviewSchema.post(/^findOneAnd/, async function(doc) {
  if (doc) {
    await doc.constructor.calcAverageRatings(doc.product);
  }
});

// Query middleware to populate users
reviewSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'user',
    select: 'name photo'
  });
  
  next();
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;