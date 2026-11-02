import mongoose from 'mongoose';

export const connectDB = async () => {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/ai-mystery-room';
  
  try {
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`[Database] MongoDB Connected successfully: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`[Database Error] Failed to connect to MongoDB: ${error.message}`);
    console.warn('[Database Notice] Please ensure MongoDB is running locally or provide a valid MONGODB_URI in server/.env');
    // We don't exit process immediately so error handler can respond with 500 and helpful message if DB is not reached
  }
};
