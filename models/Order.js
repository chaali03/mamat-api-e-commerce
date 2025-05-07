const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: [true, 'Produk harus diisi']
  },
  name: String,
  price: Number,
  quantity: {
    type: Number,
    required: [true, 'Jumlah produk harus diisi'],
    min: [1, 'Jumlah produk minimal 1']
  },
  image: String
});

const orderStatusHistorySchema = new mongoose.Schema({
  status: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'],
    required: [true, 'Status harus diisi']
  },
  description: String,
  timestamp: {
    type: Date,
    default: Date.now
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
});

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User harus diisi']
  },
  items: [orderItemSchema],
  shippingAddress: {
    name: String,
    phone: String,
    address: String,
    city: String,
    province: String,
    postalCode: String,
    country: {
      type: String,
      default: 'Indonesia'
    }
  },
  paymentMethod: {
    type: String,
    required: [true, 'Metode pembayaran harus diisi']
  },
  paymentResult: {
    id: String,
    status: String,
    updateTime: String,
    email: String
  },
  itemsPrice: {
    type: Number,
    required: [true, 'Harga item harus diisi']
  },
  shippingPrice: {
    type: Number,
    required: [true, 'Biaya pengiriman harus diisi']
  },
  taxPrice: {
    type: Number,
    required: [true, 'Pajak harus diisi']
  },
  totalPrice: {
    type: Number,
    required: [true, 'Total harga harus diisi']
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'],
    default: 'pending'
  },
  statusHistory: [orderStatusHistorySchema],
  isPaid: {
    type: Boolean,
    default: false
  },
  paidAt: Date,
  isDelivered: {
    type: Boolean,
    default: false
  },
  deliveredAt: Date,
  trackingNumber: String,
  shippingMethod: String,
  notes: String,
  invoiceNumber: {
    type: String,
    unique: true
  }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Middleware for creating invoice numbers
orderSchema.pre('save', async function(next) {
  if (!this.invoiceNumber) {
    const date = new Date();
    const year = date.getFullYear().toString().substr(-2);
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    
    // Get this month's order quantity
    const count = await this.constructor.countDocuments({
      createdAt: {
        $gte: new Date(date.getFullYear(), date.getMonth(), 1),
        $lt: new Date(date.getFullYear(), date.getMonth() + 1, 1)
      }
    });
    
    // Format: INV/YY/MM/XXXX
    this.invoiceNumber = `INV/${year}/${month}/${(count + 1).toString().padStart(4, '0')}`;
  }
  next();
});

// Middleware to add status history
orderSchema.pre('save', function(next) {
  if (this.isNew) {
    this.statusHistory = [{
      status: this.status,
      description: 'Pesanan dibuat'
    }];
  } else if (this.isModified('status')) {
    this.statusHistory.push({
      status: this.status,
      description: `Status diubah menjadi ${this.status}`
    });
  }
  next();
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;