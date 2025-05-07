const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Wishlist harus terkait dengan user']
  },
  items: [
    {
      product: {
        type: mongoose.Schema.ObjectId,
        ref: 'Product',
        required: [true, 'Item wishlist harus memiliki produk']
      },
      addedAt: {
        type: Date,
        default: Date.now
      }
    }
  ]
}, {
  timestamps: true
});

// Prevent duplicate products in wishlist
wishlistSchema.index({ user: 1, 'items.product': 1 }, { unique: true });

const Wishlist = mongoose.model('Wishlist', wishlistSchema);

module.exports = Wishlist;