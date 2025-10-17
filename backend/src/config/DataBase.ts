import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);
   
  } catch (error) {
    console.error("Mongodb connection failed :", error);
    process.exit(1);
  }
};

export default connectDB;
