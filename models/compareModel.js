const mongoose = require('mongoose');

const compareSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Perbandingan harus dimiliki oleh pengguna'],
    unique: true
  },
  products: [{
    type: mongoose.Schema.ObjectId,
    ref: 'Product'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indeks untuk meningkatkan performa query
compareSchema.index({ user: 1 });

// Middleware untuk memastikan maksimal 4 produk yang dibandingkan
compareSchema.pre('save', function(next) {
  if (this.products.length > 4) {
    this.products = this.products.slice(0, 4);
  }
  this.updatedAt = Date.now();
  next();
});

const Compare = mongoose.model('Compare', compareSchema);

module.exports = Compare;