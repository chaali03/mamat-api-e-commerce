const mongoose = require('mongoose');
const slugify = require('slugify');

const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Nama kategori harus diisi'],
    unique: true,
    trim: true,
    maxlength: [50, 'Nama kategori tidak boleh lebih dari 50 karakter']
  },
  slug: {
    type: String,
    unique: true
    // remove index:true here as it is already in schema.index()
  },
  description: {
    type: String,
    maxlength: [500, 'Deskripsi tidak boleh lebih dari 500 karakter']
  },
  image: {
    type: String,
    default: 'no-image.jpg'
  },
  isActive: {
    type: Boolean,
    default: true,
    select: true
  },
  parentCategory: {
    type: mongoose.Schema.ObjectId,
    ref: 'Category',
    default: null
  },
  level: {
    type: Number,
    default: 0
  },
  order: {
    type: Number,
    default: 0
  },
  productCount: {
    type: Number,
    default: 0
  },
  metadata: {
    seoTitle: String,
    seoDescription: String,
    seoKeywords: [String]
  },
  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  updatedBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
// Remove duplicate indexes here
// CategorySchema.index({ name: 1 });
// CategorySchema.index({ slug: 1 });
CategorySchema.index({ parentCategory: 1 });
CategorySchema.index({ isActive: 1 });

// Middleware to create a slug before saving
CategorySchema.pre('save', function(next) {
  this.slug = slugify(this.name, { 
    lower: true,
    strict: true,
    locale: 'id'
  });
  next();
});

// Middleware to update category level
CategorySchema.pre('save', async function(next) {
  if (this.parentCategory) {
    const parent = await this.constructor.findById(this.parentCategory);
    if (parent) {
      this.level = parent.level + 1;
    }
  }
  next();
});

// Virtual to get the number of products
CategorySchema.virtual('products', {
  ref: 'Product',
  localField: '_id',
  foreignField: 'category',
  count: true
});

// Virtual to get sub-categories
CategorySchema.virtual('subCategories', {
  ref: 'Category',
  localField: '_id',
  foreignField: 'parentCategory'
});

// Method to get the full path category
CategorySchema.methods.getFullPath = async function() {
  const path = [this.name];
  let currentCategory = this;
  
  while (currentCategory.parentCategory) {
    currentCategory = await this.constructor.findById(currentCategory.parentCategory);
    if (currentCategory) {
      path.unshift(currentCategory.name);
    }
  }
  
  return path.join(' > ');
};

// Static method to get categories with tree structure
CategorySchema.statics.getTree = async function() {
  const categories = await this.find().sort('order name');
  const tree = [];
  const map = {};

  categories.forEach(cat => {
    map[cat._id] = { 
      ...cat.toObject(), 
      children: [] 
    };
  });

  categories.forEach(cat => {
    if (cat.parentCategory && map[cat.parentCategory]) {
      map[cat.parentCategory].children.push(map[cat._id]);
    } else {
      tree.push(map[cat._id]);
    }
  });

  return tree;
};

// Query middleware untuk mengisi bidang default
CategorySchema.pre(/^find/, function(next) {
  this.populate({
    path: 'createdBy',
    select: 'name email'
  }).populate({
    path: 'updatedBy',
    select: 'name email'
  });
  
  next();
});

module.exports = mongoose.model('Category', CategorySchema);