const mongoose = require('mongoose');
const Product = require('../models/Product');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config({ path: './.env' });

// Check if the connection string is loaded
const mongoUri = process.env.MONGODB_URI || process.env.DATABASE_URL;
if (!mongoUri) {
  console.error('Error: Neither MONGODB_URI nor DATABASE_URL environment variable is defined');
  process.exit(1);
}

// Connect to database (only once)
mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('Database connected successfully'));

const updateProductFlags = async () => {
  try {
    // Update some products as new releases
    await Product.updateMany(
      { category: 'Keyboard' },
      { $set: { isNewRelease: true } },
      { limit: 5 }
    );
    
    await Product.updateMany(
      { category: 'Mouse' },
      { $set: { isNewRelease: true } },
      { limit: 5 }
    );
    
    // Update some products as best sellers
    await Product.updateMany(
      { price: { $gte: 1000000 } },
      { $set: { isBestSeller: true } },
      { limit: 5 }
    );
    
    await Product.updateMany(
      { category: 'Headset' },
      { $set: { isBestSeller: true } },
      { limit: 5 }
    );
    
    console.log('Product flags updated successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error updating product flags:', error);
    process.exit(1);
  }
};

updateProductFlags();