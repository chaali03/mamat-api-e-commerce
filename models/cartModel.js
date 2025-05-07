const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Keranjang harus dimiliki oleh pengguna'],
    unique: true
  },
  items: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: [true, 'Item keranjang harus memiliki produk']
      },
      quantity: {
        type: Number,
        required: [true, 'Item keranjang harus memiliki jumlah'],
        min: [1, 'Jumlah tidak boleh kurang dari 1'],
        default: 1
      },
      price: {
        type: Number,
        required: [true, 'Item keranjang harus memiliki harga']
      }
    }
  ],
  totalPrice: {
    type: Number,
    default: 0
  },
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

// Middleware untuk menghitung total harga
cartSchema.pre('save', function(next) {
  this.totalPrice = this.items.reduce((total, item) => {
    return total + (item.price * item.quantity);
  }, 0);
  
  this.updatedAt = Date.now();
  next();
});

// Fix: Use cartSchema instead of CartSchema
module.exports = mongoose.models.Cart || mongoose.model('Cart', cartSchema);