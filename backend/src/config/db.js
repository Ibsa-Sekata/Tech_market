import mongoose from "mongoose";

const MAX_RETRIES = 3;

export async function connectDB(mongoUri, retries = MAX_RETRIES) {
  let lastError;

  for (let attempt = 1; attempt <= retries; attempt += 1) {
    try {
      await mongoose.connect(mongoUri, {
        serverSelectionTimeoutMS: 5000,
        connectTimeoutMS: 10000,
        socketTimeoutMS: 30000,
        maxPoolSize: 30,
        minPoolSize: 5,
        maxIdleTimeMS: 300000
      });
      console.log(`MongoDB connected on attempt ${attempt}`);
      return;
    } catch (error) {
      lastError = error;
      console.error(`MongoDB connection attempt ${attempt} failed: ${error.message}`);
    }
  }

  throw lastError;
}
