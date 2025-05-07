const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

// Get all categories with filtering, sorting, and pagination
router.get('/', catchAsync(async (req, res, next) => {
  // Query parameters
  const queryObj = { ...req.query };
  const excludedFields = ['page', 'sort', 'limit', 'fields', 'search'];
  excludedFields.forEach(el => delete queryObj[el]);

  // Filter for active categories by default
  queryObj.isActive = queryObj.isActive !== 'false';

  // Build query
  let query = Category.find(queryObj)
    .populate({
      path: 'subcategories',
      match: { isActive: true },
      select: 'name slug image level'
    })
    .where({ parent: null });

  // Search functionality
  if (req.query.search) {
    query = query.or([
      { name: { $regex: req.query.search, $options: 'i' } },
      { description: { $regex: req.query.search, $options: 'i' } }
    ]);
  }

  // Sorting
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    query = query.sort('name');
  }

  // Field limiting
  if (req.query.fields) {
    const fields = req.query.fields.split(',').join(' ');
    query = query.select(fields);
  }

  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit;

  // Get total count for pagination
  const totalCategories = await Category.countDocuments({ parent: null, ...queryObj });

  query = query.skip(skip).limit(limit);
  const categories = await query;

  res.status(200).json({
    status: 'success',
    results: categories.length,
    pagination: {
      current: page,
      total: Math.ceil(totalCategories / limit),
      size: limit,
      totalItems: totalCategories
    },
    data: { categories }
  });
}));

// Get category tree (hierarchical structure)
router.get('/tree', catchAsync(async (req, res, next) => {
  const categories = await Category.find({ parent: null, isActive: true })
    .populate({
      path: 'subcategories',
      match: { isActive: true },
      populate: {
        path: 'subcategories',
        match: { isActive: true },
        select: 'name slug image level'
      },
      select: 'name slug image level'
    })
    .select('name slug image level')
    .sort('name');

  res.status(200).json({
    status: 'success',
    results: categories.length,
    data: { categories }
  });
}));

// Get category by slug
router.get('/slug/:slug', catchAsync(async (req, res, next) => {
  const category = await Category.findOne({ slug: req.params.slug })
    .populate({
      path: 'subcategories',
      match: { isActive: true },
      select: 'name slug image level'
    });

  if (!category) {
    return next(new AppError('Kategori tidak ditemukan', 404));
  }

  res.status(200).json({
    status: 'success',
    data: { category }
  });
}));

// Get category ancestors
router.get('/:id/ancestors', catchAsync(async (req, res, next) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    return next(new AppError('Kategori tidak ditemukan', 404));
  }

  const ancestors = [];
  let currentCategory = category;

  while (currentCategory.parent) {
    currentCategory = await Category.findById(currentCategory.parent);
    if (currentCategory && currentCategory.isActive) {
      ancestors.unshift({
        _id: currentCategory._id,
        name: currentCategory.name,
        slug: currentCategory.slug,
        level: currentCategory.level
      });
    }
  }

  res.status(200).json({
    status: 'success',
    data: { ancestors }
  });
}));

// Get single category by ID
router.get('/:id', catchAsync(async (req, res, next) => {
  const category = await Category.findById(req.params.id)
    .populate({
      path: 'subcategories',
      match: { isActive: true },
      select: 'name slug image level'
    });

  if (!category) {
    return next(new AppError('Kategori tidak ditemukan', 404));
  }

  res.status(200).json({
    status: 'success',
    data: { category }
  });
}));

// Create new category
router.post('/', catchAsync(async (req, res, next) => {
  // Check if parent exists if specified
  if (req.body.parent) {
    const parentExists = await Category.exists({ _id: req.body.parent });
    if (!parentExists) {
      return next(new AppError('Kategori induk tidak ditemukan', 400));
    }
    
    // Get parent's level and set child's level
    const parent = await Category.findById(req.body.parent);
    req.body.level = parent.level + 1;
  }

  const category = await Category.create(req.body);
  
  res.status(201).json({
    status: 'success',
    data: { category }
  });
}));

// Update category
router.patch('/:id', catchAsync(async (req, res, next) => {
  // Check if trying to update parent
  if (req.body.parent) {
    // Prevent setting parent to self
    if (req.body.parent === req.params.id) {
      return next(new AppError('Kategori tidak bisa menjadi induk dari dirinya sendiri', 400));
    }
    
    // Check if new parent exists
    const parentExists = await Category.exists({ _id: req.body.parent });
    if (!parentExists) {
      return next(new AppError('Kategori induk tidak ditemukan', 400));
    }

    // Prevent circular references
    const parent = await Category.findById(req.body.parent);
    let currentParent = parent;
    while (currentParent.parent) {
      if (currentParent.parent.toString() === req.params.id) {
        return next(new AppError('Terdeteksi referensi melingkar dalam hierarki kategori', 400));
      }
      currentParent = await Category.findById(currentParent.parent);
    }

    // Update level based on new parent
    req.body.level = parent.level + 1;

    // Update levels of all subcategories
    const updateSubcategoriesLevel = async (categoryId, level) => {
      const subcategories = await Category.find({ parent: categoryId });
      for (const sub of subcategories) {
        sub.level = level + 1;
        await sub.save();
        await updateSubcategoriesLevel(sub._id, sub.level);
      }
    };
    
    await updateSubcategoriesLevel(req.params.id, req.body.level);
  }

  const category = await Category.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true
    }
  ).populate({
    path: 'subcategories',
    match: { isActive: true },
    select: 'name slug image level'
  });

  if (!category) {
    return next(new AppError('Kategori tidak ditemukan', 404));
  }

  res.status(200).json({
    status: 'success',
    data: { category }
  });
}));

// Soft delete category
router.delete('/:id', catchAsync(async (req, res, next) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    return next(new AppError('Kategori tidak ditemukan', 404));
  }

  // Check if category has active subcategories
  const hasSubcategories = await Category.exists({ 
    parent: req.params.id,
    isActive: true 
  });
  
  if (hasSubcategories) {
    return next(new AppError('Tidak dapat menghapus kategori yang memiliki sub-kategori aktif. Harap nonaktifkan sub-kategori terlebih dahulu.', 400));
  }

  // Soft delete instead of hard delete
  category.isActive = false;
  await category.save();

  res.status(200).json({
    status: 'success',
    message: 'Kategori berhasil dinonaktifkan'
  });
}));

module.exports = router;