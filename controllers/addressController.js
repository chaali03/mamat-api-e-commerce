const Address = require('../models/Address');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

/**
 * Get all addresses for the logged-in user
 */
exports.getUserAddresses = catchAsync(async (req, res, next) => {
  const addresses = await Address.find({ user: req.user.id });

  res.status(200).json({
    status: 'success',
    results: addresses.length,
    data: {
      addresses
    }
  });
});

/**
 * Add a new address for the logged-in user
 */
exports.addAddress = catchAsync(async (req, res, next) => {
  // Add user ID to request body
  req.body.user = req.user.id;
  
  const address = await Address.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      address
    }
  });
});

/**
 * Update an existing address
 */
exports.updateAddress = catchAsync(async (req, res, next) => {
  const address = await Address.findOneAndUpdate(
    { _id: req.params.addressId, user: req.user.id },
    req.body,
    { new: true, runValidators: true }
  );

  if (!address) {
    return next(new AppError('Alamat tidak ditemukan atau Anda tidak memiliki akses', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      address
    }
  });
});

/**
 * Delete an address
 */
exports.deleteAddress = catchAsync(async (req, res, next) => {
  const address = await Address.findOneAndDelete({
    _id: req.params.addressId,
    user: req.user.id
  });

  if (!address) {
    return next(new AppError('Alamat tidak ditemukan atau Anda tidak memiliki akses', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null
  });
});

/**
 * Set an address as default
 */
exports.setDefaultAddress = catchAsync(async (req, res, next) => {
  // Find the address and ensure it belongs to the user
  const address = await Address.findOne({
    _id: req.params.addressId,
    user: req.user.id
  });

  if (!address) {
    return next(new AppError('Alamat tidak ditemukan atau Anda tidak memiliki akses', 404));
  }

  // Set as default (the pre-save hook will handle unsetting other defaults)
  address.isDefault = true;
  await address.save();

  res.status(200).json({
    status: 'success',
    data: {
      address
    }
  });
});