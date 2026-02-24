import mongoose from 'mongoose';
import { tenantPlugin } from '../infrastructure/database/TenantPlugin';
import dotenv from "dotenv";
import logger from "../shared/utils/logger";

dotenv.config();

const connectDB = async () => {
  try {
    mongoose.plugin(tenantPlugin);
    await mongoose.connect(process.env.MONGO_URI as string, {
      serverSelectionTimeoutMS: 5000, // fail fast
    });

    logger.info("✅ MongoDB Connected");
  } catch (error) {
    logger.error("❌ MongoDB connection failed", error);

    // ❌ Do not crash production server
    if (process.env.NODE_ENV !== "production") {
      process.exit(1);
    }
  }
};

export default connectDB;
