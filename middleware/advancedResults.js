const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

const advancedResults = (model, populateOptions = []) => catchAsync(async (req, res, next) => {
  // 1) Filtering
  const queryObj = { ...req.query };
  const excludedFields = ['page', 'sort', 'limit', 'fields', 'search'];
  excludedFields.forEach(el => delete queryObj[el]);

  // 2) Advanced filtering (gte, gt, lte, lt)
  let queryStr = JSON.stringify(queryObj);
  queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

  let query = model.find(JSON.parse(queryStr));

  // 3) Search functionality
  if (req.query.search) {
    const searchFields = model.schema.obj && Object.keys(model.schema.obj)
      .filter(key => model.schema.obj[key].type === String)
      .join(' ');

    if (searchFields) {
      query = query.or(
        searchFields.split(' ').map(field => ({
          [field]: { $regex: req.query.search, $options: 'i' }
        }))
      );
    }
  }

  // 4) Sorting
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    query = query.sort('-createdAt');
  }

  // 5) Field limiting
  if (req.query.fields) {
    const fields = req.query.fields.split(',').join(' ');
    query = query.select(fields);
  } else {
    query = query.select('-__v');
  }

  // 6) Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 25;
  const skip = (page - 1) * limit;
  const total = await model.countDocuments(query.getFilter());

  query = query.skip(skip).limit(limit);

  // 7) Population
  if (populateOptions.length > 0) {
    populateOptions.forEach(populate => {
      query = query.populate(populate);
    });
  }

  // Execute query
  const results = await query;

  // Pagination result
  const pagination = {
    total,
    page,
    limit,
    pages: Math.ceil(total / limit)
  };

  if (skip >= total) {
    return next(new AppError('Halaman ini tidak ditemukan', 404));
  }

  res.advancedResults = {
    success: true,
    count: results.length,
    pagination,
    data: results
  };

  next();
});

module.exports = advancedResults;