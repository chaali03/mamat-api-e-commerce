// utils/productHelpers.js
const AppError = require('./appError');

// Define allowed product categories
const ALLOWED_CATEGORIES = ['Keyboard', 'Mouse', 'Mousepad', 'Headset', 'Switch', 'Accessories'];
const CATEGORY_PREFIXES = {
  Keyboard: 'KB',
  Mouse: 'MS',
  Mousepad: 'MP',
  Headset: 'HS',
  Switch: 'SW',
  Accessories: 'AC'
};

const validateCategory = (category) => {
  if (!ALLOWED_CATEGORIES.includes(category)) {
    throw new AppError(
      `Invalid product category. Allowed categories: ${ALLOWED_CATEGORIES.join(', ')}`,
      400
    );
  }
};

const generateSKU = (category) => {
  validateCategory(category);
  const prefix = category.substring(0, 2).toUpperCase();
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}-${randomNum}`;
};

const generateProductId = (category) => {
  validateCategory(category);
  const randomNum = Math.floor(100 + Math.random() * 900);
  return `${CATEGORY_PREFIXES[category]}${randomNum}`;
};

const generateRating = () => ({
  average: parseFloat((3.5 + Math.random() * 1.5).toFixed(1)),
  count: Math.floor(10 + Math.random() * 500),
  distribution: {
    1: Math.floor(Math.random() * 20),
    2: Math.floor(Math.random() * 30),
    3: Math.floor(Math.random() * 50),
    4: Math.floor(Math.random() * 100),
    5: Math.floor(Math.random() * 300)
  }
});

const generateWeight = (min = 800, max = 1000) => Math.floor(Math.random() * (max - min + 1)) + min;

const generateProductVariants = (baseProduct) => {
  const variants = ['Color', 'Size', 'Material'];
  const selectedVariant = variants[Math.floor(Math.random() * variants.length)];
  
  return {
    type: selectedVariant,
    options: Array.from({ length: Math.floor(Math.random() * 3) + 1 }, (_, i) => ({
      name: `${selectedVariant} Option ${i+1}`,
      priceModifier: Math.random() > 0.5 ? Math.floor(Math.random() * 50) : 0,
      stock: Math.floor(Math.random() * 100),
      sku: `${baseProduct.sku}-${i+1}`,
      images: baseProduct.images || []
    }))
  };
};

const calculateDiscountPrice = (price, discountPercentage) => {
  return parseFloat((price * (1 - discountPercentage / 100)).toFixed(2));
};

const generateDimensions = () => {
  const x = Math.floor(100 + Math.random() * 400);
  const y = Math.floor(50 + Math.random() * 200);
  const z = Math.floor(10 + Math.random() * 50);
  return `${x}×${y}×${z}mm`;
};

module.exports = {
  ALLOWED_CATEGORIES,
  CATEGORY_PREFIXES,
  validateCategory,
  generateSKU,
  generateProductId,
  generateRating,
  generateWeight,
  generateProductVariants,
  calculateDiscountPrice,
  generateDimensions
};