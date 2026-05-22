// Database configuration
// Connects MongoDB with Mongoose

const mongoose = require('mongoose');

// MongoDB connection URI
const mongoURI = 'mongodb://127.0.0.1:27017/quizmasterDB';

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✓ MongoDB connected successfully');
    console.log(`  Database: quizmasterDB`);
  } catch (error) {
    console.error('✗ MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
