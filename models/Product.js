const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');

// ==================== CONSTANTS ====================
const BRANDS = [
  // Specialized gaming brands
  'Ajazz', 'Aula', 'Rexus', 'Noir', 'Armaggeddon', 'Fantech', 'Digital Alliance',
  'Razer', 'Logitech', 'SteelSeries', 'HyperX', 'Corsair', 'Keychron', 'Royal Kludge',
  'Ducky', 'Varmilo', 'Leopold', 'Glorious', 'Wooting', 'Akko', 'Gateron', 'Kailh',
  'JWK', 'Durock', 'Everglide', 'Outemu', 'Tecware', 'Redragon', 'Bloody', 'Monsgeek'
];

const CATEGORIES = ['Keyboard', 'Mouse', 'Headset', 'Mousepad', 'Switch', 'Accessories'];

const KEYBOARD_SUB_CATEGORIES = ['Mechanical', 'Membrane', 'Optical', 'Magnetic'];
const MOUSE_SUB_CATEGORIES = ['Gaming', 'Office', 'Wireless', 'Ergonomic'];
const HEADSET_SUB_CATEGORIES = ['Gaming', 'Music', 'Wireless', 'Noise-Cancelling'];
const MOUSEPAD_SUB_CATEGORIES = ['Hard', 'Soft', 'RGB', 'Extended'];
const SWITCH_SUB_CATEGORIES = ['Linear', 'Tactile', 'Clicky', 'Silent'];
const ACCESSORIES_SUB_CATEGORIES = ['Cable', 'Keycap', 'Lube', 'Stabilizer', 'Toolkit'];

// ==================== SCHEMA DEFINITIONS ====================

// Keyboard Specifications Schema
const keyboardSpecSchema = new mongoose.Schema({
  switchType: {
    type: String,
    required: [true, 'Tipe switch wajib diisi'],
    enum: {
      values: ['Mechanical', 'Membrane', 'Optical', 'Magnetic'],
      message: 'Tipe switch {VALUE} tidak valid'
    }
  },
  layout: {
    type: String,
    required: [true, 'Layout keyboard wajib diisi'],
    enum: {
      values: ['Full-size', 'TKL', '75%', '65%', '60%', '40%'],
      message: 'Layout {VALUE} tidak valid'
    }
  },
  connectivity: {
    type: String,
    required: [true, 'Konektivitas wajib diisi'],
    enum: {
      values: ['Wired', 'Wireless', 'Bluetooth', 'Hybrid'],
      message: 'Konektivitas {VALUE} tidak valid'
    }
  },
  keycaps: {
    type: String,
    enum: {
      values: ['ABS', 'PBT', 'Double-shot', 'Custom'],
      message: 'Material keycaps {VALUE} tidak valid'
    }
  },
  backlight: {
    type: String,
    enum: {
      values: ['None', 'Single-color', 'RGB', 'Per-key RGB'],
      message: 'Tipe backlight {VALUE} tidak valid'
    }
  },
  hotSwappable: Boolean,
  compatibility: {
    type: [String],
    enum: ['Windows', 'Mac', 'Linux', 'Android', 'iOS']
  },
  batteryLife: {
    type: String,
    validate: {
      validator: function(v) {
        return validator.matches(v, /^\d+\s?hours?$/i);
      },
      message: 'Format battery life tidak valid (contoh: "40 hours")'
    }
  },
  actuationForce: {
    type: String,
    validate: {
      validator: function(v) {
        return validator.matches(v, /^\d+\s?g$/i);
      },
      message: 'Format actuation force tidak valid (contoh: "45g")'
    }
  },
  pollingRate: {
    type: String,
    validate: {
      validator: function(v) {
        return validator.matches(v, /^\d+\s?Hz$/i);
      },
      message: 'Format polling rate tidak valid (contoh: "1000Hz")'
    }
  },
  weight: {
    type: String,
    validate: {
      validator: function(v) {
        return validator.matches(v, /^\d+\s?g$/i);
      },
      message: 'Format berat tidak valid (contoh: "950g")'
    }
  },
  dimensions: String
}, { _id: false });

// Mouse Specifications Schema
const mouseSpecSchema = new mongoose.Schema({
  sensorType: {
    type: String,
    required: [true, 'Tipe sensor wajib diisi'],
    enum: ['Optical', 'Laser', 'Infrared']
  },
  dpi: {
    type: String,
    required: [true, 'DPI wajib diisi'],
    validate: {
      validator: function(v) {
        return validator.matches(v, /^\d+\s?DPI$/i);
      },
      message: 'Format DPI tidak valid (contoh: "16000DPI")'
    }
  },
  connectivity: {
    type: String,
    required: [true, 'Konektivitas wajib diisi'],
    enum: ['Wired', 'Wireless 2.4GHz', 'Bluetooth', 'Hybrid']
  },
  switches: String,
  pollingRate: {
    type: String,
    validate: {
      validator: function(v) {
        return validator.matches(v, /^\d+\s?Hz$/i);
      },
      message: 'Format polling rate tidak valid (contoh: "1000Hz")'
    }
  },
  buttons: {
    type: Number,
    min: [2, 'Mouse harus memiliki minimal 2 tombol']
  },
  weight: {
    type: String,
    validate: {
      validator: function(v) {
        return validator.matches(v, /^\d+\s?g$/i);
      },
      message: 'Format berat tidak valid (contoh: "95g")'
    }
  },
  batteryLife: {
    type: String,
    validate: {
      validator: function(v) {
        return validator.matches(v, /^\d+\s?hours?$/i);
      },
      message: 'Format battery life tidak valid (contoh: "70 hours")'
    }
  },
  dimensions: String
}, { _id: false });

// Headset Specifications Schema
const headsetSpecSchema = new mongoose.Schema({
  driverSize: {
    type: String,
    required: [true, 'Ukuran driver wajib diisi'],
    validate: {
      validator: function(v) {
        return validator.matches(v, /^\d+\s?mm$/i);
      },
      message: 'Format driver size tidak valid (contoh: "50mm")'
    }
  },
  frequencyResponse: {
    type: String,
    validate: {
      validator: function(v) {
        return validator.matches(v, /^\d+-\d+\s?Hz$/i);
      },
      message: 'Format frequency response tidak valid (contoh: "20-20000Hz")'
    }
  },
  impedance: {
    type: String,
    validate: {
      validator: function(v) {
        return validator.matches(v, /^\d+\s?Ω$/i);
      },
      message: 'Format impedance tidak valid (contoh: "32Ω")'
    }
  },
  microphone: {
    type: String,
    enum: ['None', 'Detachable', 'Built-in', 'Retractable']
  },
  connectivity: {
    type: String,
    required: [true, 'Konektivitas wajib diisi'],
    enum: ['Wired', 'Wireless', 'Bluetooth']
  },
  noiseCancelling: Boolean,
  batteryLife: {
    type: String,
    validate: {
      validator: function(v) {
        return validator.matches(v, /^\d+\s?hours?$/i);
      },
      message: 'Format battery life tidak valid (contoh: "30 hours")'
    }
  },
  weight: {
    type: String,
    validate: {
      validator: function(v) {
        return validator.matches(v, /^\d+\s?g$/i);
      },
      message: 'Format berat tidak valid (contoh: "320g")'
    }
  },
  dimensions: String
}, { _id: false });

// Mousepad Specifications Schema
const mousepadSpecSchema = new mongoose.Schema({
  size: {
    type: String,
    required: [true, 'Ukuran mousepad wajib diisi'],
    enum: ['Small', 'Medium', 'Large', 'XL', 'XXL', 'Custom']
  },
  material: {
    type: String,
    enum: ['Cloth', 'Hard', 'Hybrid', 'Glass']
  },
  thickness: {
    type: String,
    validate: {
      validator: function(v) {
        return validator.matches(v, /^\d+\s?mm$/i);
      },
      message: 'Format thickness tidak valid (contoh: "4mm")'
    }
  },
  surfaceType: {
    type: String,
    enum: ['Smooth', 'Textured', 'Control', 'Speed']
  },
  baseMaterial: String,
  rgbLighting: Boolean,
  stitchedEdges: Boolean,
  weight: {
    type: String,
    validate: {
      validator: function(v) {
        return validator.matches(v, /^\d+\s?g$/i);
      },
      message: 'Format berat tidak valid (contoh: "350g")'
    }
  },
  dimensions: String
}, { _id: false });

// Switch Specifications Schema
const switchSpecSchema = new mongoose.Schema({
  type: {
    type: String,
    required: [true, 'Tipe switch wajib diisi'],
    enum: ['Linear', 'Tactile', 'Clicky', 'Silent']
  },
  actuationForce: {
    type: String,
    required: [true, 'Actuation force wajib diisi'],
    validate: {
      validator: function(v) {
        return validator.matches(v, /^\d+\s?g$/i);
      },
      message: 'Format actuation force tidak valid (contoh: "45g")'
    }
  },
  travelDistance: {
    type: String,
    validate: {
      validator: function(v) {
        return validator.matches(v, /^\d+\.?\d*\s?mm$/i);
      },
      message: 'Format travel distance tidak valid (contoh: "4mm")'
    }
  },
  lifespan: {
    type: String,
    validate: {
      validator: function(v) {
        return validator.matches(v, /^\d+\s?million clicks$/i);
      },
      message: 'Format lifespan tidak valid (contoh: "50 million clicks")'
    }
  },
  pinType: {
    type: String,
    enum: ['3-pin', '5-pin']
  },
  housingMaterial: String,
  stemMaterial: String,
  springType: String,
  lubed: Boolean
}, { _id: false });

// Accessories Specifications Schema
const accessorySpecSchema = new mongoose.Schema({
  type: {
    type: String,
    required: [true, 'Tipe aksesoris wajib diisi'],
    enum: ['Cable', 'Keycap', 'Lube', 'Stabilizer', 'Toolkit']
  },
  material: String,
  compatibility: [String],
  length: {
    type: String,
    validate: {
      validator: function(v) {
        return validator.matches(v, /^\d+\s?cm$/i);
      },
      message: 'Format panjang tidak valid (contoh: "150cm")'
    }
  },
  weight: {
    type: String,
    validate: {
      validator: function(v) {
        return validator.matches(v, /^\d+\s?g$/i);
      },
      message: 'Format berat tidak valid (contoh: "50g")'
    }
  }
}, { _id: false });

// Main Product Schema
const productSchema = new mongoose.Schema({
  productId: {
    type: String,
    required: [true, 'ID produk wajib diisi'],
    unique: true,
    uppercase: true,
    validate: {
      validator: function(v) {
        return validator.matches(v, /^[A-Z0-9]{6,10}$/);
      },
      message: 'ID produk harus 6-10 karakter alfanumerik'
    }
  },
  sku: {
    type: String,
    unique: true,
    validate: {
      validator: function(v) {
        return validator.matches(v, /^[A-Z]{2,4}-\d{3,6}$/);
      },
      message: 'Format SKU tidak valid (contoh: "KB-1001")'
    }
  },
  name: {
    type: String,
    required: [true, 'Nama produk wajib diisi'],
    trim: true,
    minlength: [3, 'Nama produk minimal 3 karakter'],
    maxlength: [100, 'Nama produk maksimal 100 karakter'],
    validate: {
      validator: function(v) {
        return !validator.contains(v, '  ');
      },
      message: 'Nama produk tidak boleh mengandung spasi ganda'
    }
    // Remove index: true from here if it exists
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true
    // Remove index: true from here
  },
  description: {
    type: String,
    required: [true, 'Deskripsi produk wajib diisi'],
    minlength: [20, 'Deskripsi produk minimal 20 karakter'],
    maxlength: [2000, 'Deskripsi produk maksimal 2000 karakter']
  },
  shortDescription: {
    type: String,
    maxlength: [150, 'Deskripsi singkat maksimal 150 karakter']
  },
  price: {
    type: Number,
    required: [true, 'Harga produk wajib diisi'],
    min: [1000, 'Harga minimal Rp 1.000'],
    max: [50000000, 'Harga maksimal Rp 50.000.000']
  },
  cost: {
    type: Number,
    min: [500, 'Harga cost minimal Rp 500'],
    max: [30000000, 'Harga cost maksimal Rp 30.000.000']
  },
  category: {
    type: String,
    required: [true, 'Kategori produk wajib diisi'],
    enum: {
      values: CATEGORIES,
      message: 'Kategori {VALUE} tidak valid'
    }
  },
  subCategory: {
    type: String,
    required: [true, 'Sub-kategori produk wajib diisi'],
    validate: {
      validator: function(v) {
        switch (this.category) {
          case 'Keyboard': return KEYBOARD_SUB_CATEGORIES.includes(v);
          case 'Mouse': return MOUSE_SUB_CATEGORIES.includes(v);
          case 'Headset': return HEADSET_SUB_CATEGORIES.includes(v);
          case 'Mousepad': return MOUSEPAD_SUB_CATEGORIES.includes(v);
          case 'Switch': return SWITCH_SUB_CATEGORIES.includes(v);
          case 'Accessories': return ACCESSORIES_SUB_CATEGORIES.includes(v);
          default: return false;
        }
      },
      message: 'Sub-kategori {VALUE} tidak valid untuk kategori ini'
    }
  },
  brand: {
    type: String,
    required: [true, 'Merek produk wajib diisi'],
    enum: {
      values: BRANDS,
      message: 'Merek {VALUE} tidak didukung'
    }
  },
  model: {
    type: String,
    maxlength: [50, 'Model maksimal 50 karakter']
  },
  stock: {
    type: Number,
    required: [true, 'Stok produk wajib diisi'],
    min: [0, 'Stok tidak boleh negatif'],
    default: 0
  },
  reservedStock: {
    type: Number,
    min: 0,
    default: 0
  },
  images: {
    type: [String],
    validate: {
      validator: function(v) {
        return v.length > 0 && v.length <= 10;
      },
      message: 'Produk harus memiliki 1-10 gambar'
    },
    required: [true, 'Gambar produk wajib diisi']
  },
  thumbnail: {
    type: String,
    required: [true, 'Thumbnail produk wajib diisi']
  },
  specs: {
    type: mongoose.Schema.Types.Mixed,
    required: [true, 'Spesifikasi produk wajib diisi'],
    validate: {
      validator: function(v) {
        switch (this.category) {
          case 'Keyboard': return v.switchType && v.layout && v.connectivity;
          case 'Mouse': return v.sensorType && v.dpi && v.connectivity;
          case 'Headset': return v.driverSize && v.connectivity;
          case 'Mousepad': return v.size && v.material;
          case 'Switch': return v.type && v.actuationForce;
          case 'Accessories': return v.type;
          default: return false;
        }
      },
      message: 'Spesifikasi tidak lengkap untuk kategori ini'
    }
  },
  features: {
    type: [String],
    maxlength: [30, 'Maksimal 30 fitur']
  },
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
      set: val => Math.round(val * 10) / 10
    },
    count: {
      type: Number,
      default: 0,
      min: 0
    },
    distribution: {
      1: { type: Number, default: 0 },
      2: { type: Number, default: 0 },
      3: { type: Number, default: 0 },
      4: { type: Number, default: 0 },
      5: { type: Number, default: 0 }
    }
  },
  weight: {
    type: String,
    required: [true, 'Berat produk wajib diisi'],
    validate: {
      validator: function(v) {
        return validator.matches(v, /^\d+\s?g$/i);
      },
      message: 'Format berat tidak valid (contoh: "950g")'
    }
  },
  dimensions: {
    type: String,
    required: [true, 'Dimensi produk wajib diisi'],
    validate: {
      validator: function(v) {
        return validator.matches(v, /^\d+×\d+×\d+\s?mm$/i);
      },
      message: 'Format dimensi tidak valid (contoh: "360×120×40mm")'
    }
  },
  warranty: {
    type: String,
    validate: {
      validator: function(v) {
        return validator.matches(v, /^\d+\s?(month|year)s?$/i);
      },
      message: 'Format garansi tidak valid (contoh: "1 year")'
    }
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  isNewRelease: {
    type: Boolean,
    default: false
  },
  isBestSeller: {
    type: Boolean,
    default: false
  },
  isOnSale: {
    type: Boolean,
    default: false
  },
  discount: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  discountStart: Date,
  discountEnd: Date,
  metaTitle: {
    type: String,
    maxlength: [70, 'Meta title maksimal 70 karakter']
  },
  metaDescription: {
    type: String,
    maxlength: [160, 'Meta description maksimal 160 karakter']
  },
  tags: [String],
  variants: [{
    color: String,
    image: String,
    stock: {
      type: Number,
      min: 0
    }
  }],
  relatedProducts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }],
  // Tambahkan field reviews jika belum ada
  reviews: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Review'
  }],
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// ==================== VIRTUAL PROPERTIES ====================

// Formatted price
productSchema.virtual('priceFormatted').get(function() {
  return `Rp ${this.price.toLocaleString('id-ID')}`;
});

// Discount price
productSchema.virtual('discountPrice').get(function() {
  return this.discount > 0 
    ? Math.round(this.price * (100 - this.discount) / 100)
    : this.price;
});

// Formatted discount price
productSchema.virtual('discountPriceFormatted').get(function() {
  return `Rp ${this.discountPrice.toLocaleString('id-ID')}`;
});

// Stock status
productSchema.virtual('stockStatus').get(function() {
  if (this.stock <= 0) return 'Sold Out';
  if (this.stock < 5) return 'Low Stock';
  if (this.stock < 20) return 'Limited Stock';
  return 'In Stock';
});

// Available stock
productSchema.virtual('availableStock').get(function() {
  return this.stock - this.reservedStock;
});

// Discount active status
productSchema.virtual('isDiscountActive').get(function() {
  if (!this.discountStart || !this.discountEnd) return this.discount > 0;
  const now = new Date();
  return this.discount > 0 && now >= this.discountStart && now <= this.discountEnd;
});

// Effective discount price
productSchema.virtual('effectivePrice').get(function() {
  return this.isDiscountActive ? this.discountPrice : this.price;
});

// Profit margin
productSchema.virtual('profitMargin').get(function() {
  if (!this.cost) return null;
  return Math.round(((this.price - this.cost) / this.cost) * 100);
});

// ==================== MIDDLEWARE ====================

// Generate slug before saving
productSchema.pre('save', function(next) {
  if (this.isModified('name')) {
    this.slug = slugify(this.name, {
      lower: true,
      strict: true,
      remove: /[*+~.()'"!:@]/g
    });
  }
  next();
});

// Generate SKU if not provided
productSchema.pre('save', function(next) {
  if (!this.sku) {
    const prefix = this.category.substring(0, 2).toUpperCase();
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    this.sku = `${prefix}-${randomNum}`;
  }
  next();
});

// Validate discount dates
productSchema.pre('save', function(next) {
  if (this.discountStart && this.discountEnd && this.discountStart > this.discountEnd) {
    throw new Error('Tanggal mulai diskon tidak boleh setelah tanggal berakhir');
  }
  next();
});

// Auto-set isOnSale based on discount
productSchema.pre('save', function(next) {
  if (this.isModified('discount') || this.isModified('discountStart') || this.isModified('discountEnd')) {
    this.isOnSale = this.isDiscountActive;
  }
  next();
});

// ==================== STATIC METHODS ====================

// Find by category with pagination
productSchema.statics.findByCategory = function(category, page = 1, limit = 10) {
  const skip = (page - 1) * limit;
  return this.find({ category })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
};

// Find by brand with sorting
productSchema.statics.findByBrand = function(brand, sort = 'price', order = 'asc') {
  const sortOrder = order === 'desc' ? -1 : 1;
  return this.find({ brand }).sort({ [sort]: sortOrder });
};

// Find featured products
productSchema.statics.findFeatured = function(limit = 10) {
  return this.find({ isFeatured: true })
    .sort({ createdAt: -1 })
    .limit(limit);
};

// Find new releases
productSchema.statics.findNewReleases = function(limit = 10) {
  return this.find({ isNewRelease: true })
    .sort({ createdAt: -1 })
    .limit(limit);
};

// Find best sellers
productSchema.statics.findBestSellers = function(limit = 10) {
  return this.find({ isBestSeller: true })
    .sort({ 'rating.average': -1 })
    .limit(limit);
};

// Find products on sale
productSchema.statics.findOnSale = function(limit = 10) {
  return this.find({ isOnSale: true })
    .sort({ discount: -1 })
    .limit(limit);
};

// Search products
productSchema.statics.search = function(query, limit = 10) {
  return this.find({
    $or: [
      { name: { $regex: query, $options: 'i' } },
      { description: { $regex: query, $options: 'i' } },
      { brand: { $regex: query, $options: 'i' } },
      { model: { $regex: query, $options: 'i' } }
    ]
  }).limit(limit);
};

// Get product statistics
productSchema.statics.getStats = async function() {
  const stats = await this.aggregate([
    {
      $group: {
        _id: null,
        totalProducts: { $sum: 1 },
        totalStock: { $sum: '$stock' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
        avgRating: { $avg: '$rating.average' }
      }
    },
    {
      $project: {
        _id: 0,
        totalProducts: 1,
        totalStock: 1,
        avgPrice: { $round: ['$avgPrice', 2] },
        minPrice: 1,
        maxPrice: 1,
        avgRating: { $round: ['$avgRating', 2] }
      }
    }
  ]);

  return stats[0] || {};
};

// ==================== INSTANCE METHODS ====================

// Update stock
productSchema.methods.updateStock = function(quantity) {
  if (this.stock + quantity < 0) {
    throw new Error('Stok tidak mencukupi');
  }
  this.stock += quantity;
  return this.save();
};

// Reserve stock
productSchema.methods.reserveStock = function(quantity) {
  if (this.availableStock < quantity) {
    throw new Error('Stok tersedia tidak mencukupi');
  }
  this.reservedStock += quantity;
  return this.save();
};

// Release stock
productSchema.methods.releaseStock = function(quantity) {
  if (this.reservedStock < quantity) {
    throw new Error('Stok yang direservasi tidak mencukupi');
  }
  this.reservedStock -= quantity;
  return this.save();
};

// Add review
productSchema.methods.addReview = function(reviewId, rating) {
  this.reviews.push(reviewId);
  
  // Update rating distribution
  this.rating.distribution[rating] += 1;
  this.rating.count += 1;
  
  // Recalculate average rating
  const totalRating = Object.entries(this.rating.distribution)
    .reduce((sum, [rating, count]) => sum + (Number(rating) * count), 0);
  
  this.rating.average = totalRating / this.rating.count;
  
  return this.save();
};

// ==================== INDEXES ====================

// Text search index
productSchema.index({ name: 'text', description: 'text', brand: 'text' });

// Category and subcategory index
productSchema.index({ category: 1, subCategory: 1 });

// Brand index
productSchema.index({ brand: 1 });

// Price index
productSchema.index({ price: 1 });

// Rating index
productSchema.index({ 'rating.average': -1 });

// Feature flags indexes
productSchema.index({ isFeatured: 1 });
productSchema.index({ isNewRelease: 1 });
productSchema.index({ isBestSeller: 1 });
productSchema.index({ isOnSale: 1 });

// Discount index
productSchema.index({ discount: -1 });

// IMPORTANT: Remove or comment out these two lines if they exist
// productSchema.index({ name: 1 });
// productSchema.index({ slug: 1 });

// Create the model
const Product = mongoose.model('Product', productSchema);

module.exports = Product;