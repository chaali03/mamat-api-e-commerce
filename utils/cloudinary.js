const cloudinary = require('cloudinary').v2;
const AppError = require('./appError');
const logger = require('./logger');

// Upload file to Cloudinary
const uploadToCloudinary = async (file, folder = 'default') => {
  try {
    const result = await cloudinary.uploader.upload(file, {
      folder: folder,
      resource_type: 'auto'
    });
    
    return {
      public_id: result.public_id,
      url: result.secure_url
    };
  } catch (error) {
    logger.error('Cloudinary upload error:', error);
    throw new AppError('Error uploading file to cloud storage', 500);
  }
};

// Remove file from Cloudinary
const removeFromCloudinary = async (public_id) => {
  try {
    await cloudinary.uploader.destroy(public_id);
    return true;
  } catch (error) {
    logger.error('Cloudinary delete error:', error);
    throw new AppError('Error deleting file from cloud storage', 500);
  }
};

module.exports = {
  uploadToCloudinary,
  removeFromCloudinary
};