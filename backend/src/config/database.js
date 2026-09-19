import mongoose from 'mongoose';

export async function connectDatabase(mongoUri) {
  if (!mongoUri) {
    console.warn('MONGO_URI is not configured. Starting without a database connection.');
    return false;
  }

  try {
    await mongoose.connect(mongoUri);
    console.log('MongoDB connected');
    return true;
  } catch (error) {
    console.error(`MongoDB connection failed: ${error.message}`);
    return false;
  }
}