const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: [true, 'Produk harus diisi']
  },
  quantity: {
    type: Number,
    required: [true, 'Jumlah produk harus diisi'],
    min: [1, 'Jumlah produk minimal 1']
  }
}, { timestamps: true });

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User harus diisi'],
    unique: true
  },
  items: [cartItemSchema],
  active: {
    type: Boolean,
    default: true
  }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual to calculate the total price
cartSchema.virtual('totalPrice').get(function() {
  return this.items.reduce((total, item) => {
    return total + (item.product.price * item.quantity);
  }, 0);
});

// Ubah bagian akhir file dari:
// Hapus baris ini:
// const Cart = mongoose.model('Cart', cartSchema);

// Dan ganti dengan:
let Cart;
if (mongoose.models.Cart) {
  // Gunakan model yang sudah ada
  Cart = mongoose.models.Cart;
} else {
  // Buat model baru jika belum ada
  Cart = mongoose.model('Cart', cartSchema);
}

module.exports = Cart;