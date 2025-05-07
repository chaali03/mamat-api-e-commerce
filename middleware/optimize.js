const sharp = require('sharp');

const optimize = async (req, res, next) => {
  if (!req.file) return next();

  try {
    // Optimize image if it exists
    if (req.file.mimetype.startsWith('image')) {
      const optimizedBuffer = await sharp(req.file.buffer)
        .resize(800, 800, {
          fit: 'inside',
          withoutEnlargement: true
        })
        .jpeg({ quality: 80 })
        .toBuffer();

      req.file.buffer = optimizedBuffer;
    }
    
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = optimize;