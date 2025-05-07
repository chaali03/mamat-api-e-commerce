const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: [true, 'Kupon harus memiliki kode'],
    unique: true,
    uppercase: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['percentage', 'fixed'],
    default: 'percentage'
  },
  amount: {
    type: Number,
    required: [true, 'Kupon harus memiliki jumlah diskon']
  },
  minPurchase: {
    type: Number,
    default: 0
  },
  maxDiscount: {
    type: Number,
    default: null
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: {
    type: Date,
    required: [true, 'Kupon harus memiliki tanggal berakhir']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  usageLimit: {
    type: Number,
    default: null
  },
  usedCount: {
    type: Number,
    default: 0
  },
  applicableProducts: [{
    type: mongoose.Schema.ObjectId,
    ref: 'Product'
  }],
  applicableCategories: [String],
  description: {
    type: String,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indeks untuk meningkatkan performa query
couponSchema.index({ code: 1 });
couponSchema.index({ endDate: 1 });
couponSchema.index({ isActive: 1 });

// Virtual untuk cek apakah kupon masih valid
couponSchema.virtual('isValid').get(function() {
  const now = new Date();
  return (
    this.isActive &&
    now >= this.startDate &&
    now <= this.endDate &&
    (this.usageLimit === null || this.usedCount < this.usageLimit)
  );
});

// Method untuk menghitung jumlah diskon
couponSchema.methods.calculateDiscount = function(subtotal) {
  if (!this.isValid) return 0;
  
  // Cek minimum pembelian
  if (subtotal < this.minPurchase) return 0;
  
  let discount = 0;
  
  if (this.type === 'percentage') {
    discount = (subtotal * this.amount) / 100;
    
    // Terapkan maksimum diskon jika ada
    if (this.maxDiscount !== null && discount > this.maxDiscount) {
      discount = this.maxDiscount;
    }
  } else if (this.type === 'fixed') {
    discount = this.amount;
  }
  
  return discount;
};

const Coupon = mongoose.model('Coupon', couponSchema);

module.exports = Coupon;