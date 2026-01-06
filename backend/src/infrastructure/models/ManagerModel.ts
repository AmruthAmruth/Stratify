import mongoose, { Schema, Document, Types } from "mongoose";

export interface ManagerDocument extends Document {
  name: string;
  email: string;
  phone: string;
  password: string;
  role: "manager";
  position: string;
  joiningDate: Date;
  gender: "male" | "female" | "other";
  dob: Date;
  companyId: Types.ObjectId;
  departmentId?: Types.ObjectId;
  profileImage?: string;
  address?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ManagerSchema = new Schema<ManagerDocument>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    phone: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["manager"],
      default: "manager",
      required: true,
    },
    position: { type: String, required: true },
    joiningDate: { type: Date, required: true },
    gender: { type: String, enum: ["male", "female", "other"], required: true },
    dob: { type: Date, required: true },
    companyId: { type: Schema.Types.ObjectId, ref: "Company", required: true },
    departmentId: { type: Schema.Types.ObjectId, ref: "Department" },
    profileImage: { type: String },
    address: { type: String },
  },
  { timestamps: true },
);

ManagerSchema.index({ companyId: 1, email: 1 }, { unique: true });
ManagerSchema.index({ companyId: 1, phone: 1 }, { unique: true });

export const ManagerModel = mongoose.model<ManagerDocument>(
  "Manager",
  ManagerSchema,
);
