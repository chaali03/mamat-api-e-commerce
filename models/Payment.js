const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: [true, 'Order reference is required']
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User reference is required']
  },
  amount: {
    type: Number,
    required: [true, 'Payment amount is required']
  },
  paymentMethod: {
    type: String,
    required: [true, 'Payment method is required'],
    enum: ['credit_card', 'bank_transfer', 'e_wallet']
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  transactionId: {
    type: String,
    unique: true,
    sparse: true
  },
  paymentDetails: {
    bankName: String,
    accountNumber: String,
    accountHolder: String,
    receiptUrl: String
  },
  metadata: {
    type: Map,
    of: String
  }
}, {
  timestamps: true
});

// Indexes for better query performance
paymentSchema.index({ order: 1 });
paymentSchema.index({ user: 1 });
paymentSchema.index({ status: 1 });
paymentSchema.index({ createdAt: -1 });

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;