const mongoose = require('mongoose');

const socialShareSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  product: {
    type: mongoose.Schema.ObjectId,
    ref: 'Product',
    required: [true, 'Berbagi sosial harus terkait dengan produk']
  },
  platform: {
    type: String,
    enum: ['facebook', 'twitter', 'instagram', 'whatsapp', 'telegram', 'email', 'copy'],
    required: [true, 'Platform berbagi harus ditentukan']
  },
  shareUrl: {
    type: String
  },
  shortUrl: {
    type: String
  },
  referralCode: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  clickCount: {
    type: Number,
    default: 0
  },
  conversionCount: {
    type: Number,
    default: 0
  },
  ipAddress: String,
  userAgent: String
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indeks untuk meningkatkan performa query
socialShareSchema.index({ product: 1, platform: 1 });
socialShareSchema.index({ referralCode: 1 }, { unique: true, sparse: true });
socialShareSchema.index({ createdAt: -1 });

// Middleware untuk membuat referral code
socialShareSchema.pre('save', function(next) {
  if (!this.referralCode) {
    this.referralCode = generateReferralCode();
  }
  next();
});

// Fungsi untuk menghasilkan referral code
function generateReferralCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

const SocialShare = mongoose.model('SocialShare', socialShareSchema);

module.exports = SocialShare;