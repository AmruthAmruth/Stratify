import mongoose, { Schema, Document } from "mongoose";
import { CompanyStatus } from "../../domain/entities/Company";

export interface ICompanyDoc extends Document {
  name: string;
  email: string;
  phone: string;
  industry: string;
  description?: string;
  businessRegNo: string;
  address: string;
  city: string;
  state: string;
  country: string;
  zipcode: string;
  password: string;
  status: CompanyStatus;
  profileImage?: string;
  role: "company" | "manager" | "employee";
}

const CompanySchema = new Schema<ICompanyDoc>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true, unique: true },
    industry: { type: String, required: true },
    role: {
      type: String,
      enum: ["company", "manager", "employee"],
      required: true,
    },
    description: { type: String },
    businessRegNo: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
    zipcode: { type: String, required: true },
    password: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    profileImage: { type: String },
  },
  { timestamps: true },
);

export default mongoose.model<ICompanyDoc>("Company", CompanySchema);
