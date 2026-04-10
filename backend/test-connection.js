import dotenv from 'dotenv';
import mongoose from 'mongoose';

// Load environment variables
dotenv.config();

const testConnection = async () => {
  try {
    console.log('🔄 Testing MongoDB connection...');
    console.log(`📍 Connection URI: ${process.env.MONGO_URI.replace(/\/\/.*:.*@/, '//***:***@')}`);

    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log('✅ MongoDB Connected Successfully!');
    console.log(`📊 Host: ${conn.connection.host}`);
    console.log(`📝 Database: ${conn.connection.name}`);
    console.log(`🔌 Ready State: ${conn.connection.readyState}`);

    // Test a simple operation
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log(`📋 Collections: ${collections.map(c => c.name).join(', ') || 'None yet'}`);

    // Close connection
    await mongoose.disconnect();
    console.log('🔒 Connection closed');

    process.exit(0);
  } catch (error) {
    console.error('❌ MongoDB Connection Failed:');
    console.error(`   Error: ${error.message}`);

    if (error.code === 'ECONNREFUSED') {
      console.error('💡 Suggestion: Make sure Docker is running and MongoDB container is started');
      console.error('   Try: npm run docker:up');
    }

    process.exit(1);
  }
};

testConnection();