// scripts/seedDatabase.js
const mongoose = require('mongoose');
const Product = require('../models/Product');
const productData = require('../seeders/products');

// Database connection
const dbURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mamat-db';

async function seedDatabase() {
  try {
    console.log('🔄 Connecting to database...');
    await mongoose.connect(dbURI);
    console.log('✅ Connected to database');

    console.log('🔄 Clearing existing products...');
    await Product.deleteMany({});
    console.log('✅ Products collection cleared');

    console.log('🔄 Processing product data...');
    
    const processedProducts = productData.map(product => {
      // Validate and format productId
      if (!/^[A-Z0-9]{6,10}$/.test(product.productId)) {
        // Generate a valid ID if current one is invalid
        product.productId = generateProductId(product.category);
      }
      
      // Ensure other required fields
      if (!product.thumbnail) product.thumbnail = product.images[0];
      if (!product.slug) {
        product.slug = product.name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)+/g, '');
      }
      if (!product.rating.distribution) {
        product.rating.distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
      }
      
      return product;
    });

    console.log('🔄 Inserting products...');
    const result = await Product.insertMany(processedProducts);
    console.log(`✅ Successfully inserted ${result.length} products`);

    await mongoose.disconnect();
    console.log('✅ Database connection closed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

// Helper function to generate valid product IDs
function generateProductId(category) {
  const prefix = category.substring(0, 2).toUpperCase();
  const randomNum = Math.floor(1000 + Math.random() * 9000); // 4-digit number
  return `${prefix}${randomNum}`; // Example: "KB1234"
}

seedDatabase();