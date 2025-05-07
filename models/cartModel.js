const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.ObjectId,
    ref: 'Product',
    required: [true, 'Item keranjang harus memiliki produk']
  },
  quantity: {
    type: Number,
    required: [true, 'Item keranjang harus memiliki jumlah'],
    min: [1, 'Jumlah tidak boleh kurang dari 1']
  },
  price: {
    type: Number,
    required: [true, 'Item keranjang harus memiliki harga']
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual untuk subtotal
cartItemSchema.virtual('subtotal').get(function() {
  return this.price * this.quantity;
});

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Keranjang harus dimiliki oleh pengguna']
  },
  items: [cartItemSchema],
  totalPrice: {
    type: Number,
    default: 0
  },
  totalItems: {
    type: Number,
    default: 0
  },
  coupon: {
    type: mongoose.Schema.ObjectId,
    ref: 'Coupon'
  },
  discount: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Method untuk menghitung total
cartSchema.methods.calculateTotals = function() {
  this.totalItems = this.items.reduce((sum, item) => sum + item.quantity, 0);
  
  const subtotal = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  this.totalPrice = subtotal - this.discount;
  
  return this;
};

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;