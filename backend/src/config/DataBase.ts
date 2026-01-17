import mongoose from "mongoose";
import dotenv from "dotenv";
import logger from "../shared/utils/logger";

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string, {
      serverSelectionTimeoutMS: 5000, 
    });

    logger.info("✅ MongoDB Connected");
  } catch (error) {
    logger.error("❌ MongoDB connection failed", error);

    
    if (process.env.NODE_ENV !== "production") {
      process.exit(1);
    }
  }
};

export default connectDB;
