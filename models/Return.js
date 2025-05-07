const mongoose = require('mongoose');

const returnSchema = new mongoose.Schema({
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: [true, 'Return must belong to an order']
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Return must belong to a user']
  },
  items: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: [true, 'Return item must have a product']
    },
    quantity: {
      type: Number,
      required: [true, 'Return item must have a quantity'],
      min: [1, 'Quantity must be at least 1']
    },
    reason: {
      type: String,
      required: [true, 'Return item must have a reason']
    }
  }],
  reason: {
    type: String,
    required: [true, 'Return must have a reason']
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'processing', 'completed', 'canceled'],
    default: 'pending'
  },
  statusHistory: [{
    status: String,
    date: {
      type: Date,
      default: Date.now
    },
    note: String
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Pre-save middleware to add status change to history
returnSchema.pre('save', function(next) {
  if (this.isModified('status')) {
    this.statusHistory = this.statusHistory || [];
    this.statusHistory.push({
      status: this.status,
      date: Date.now()
    });
  }
  next();
});

const Return = mongoose.model('Return', returnSchema);

module.exports = Return;