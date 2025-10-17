import mongoose, { Schema, Document, Model } from "mongoose";
import { Types } from "mongoose";

export interface EmployeeDocument extends Document {
  name: string;
  email: string;
  phone: string;
  dob: Date;
  joiningDate: Date;
  position: string;
  companyId: Types.ObjectId;
  departmentId: Types.ObjectId;
  managerId?: Types.ObjectId;
  profileImage?: string;
  password: string;
  gender: "male" | "female" | "other";
  role: "employee";
  createdAt: Date;
  updatedAt: Date;
}

const EmployeeSchema: Schema<EmployeeDocument> = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    dob: { type: Date, required: true },
    joiningDate: { type: Date, required: true },
    position: { type: String, required: true },

    companyId: { type: Schema.Types.ObjectId, ref: "Company", required: true },
    departmentId: {
      type: Schema.Types.ObjectId,
      ref: "Department",
      required: true,
    },
    managerId: { type: Schema.Types.ObjectId, ref: "Manager", default: null },

    profileImage: { type: String, default: null },

    password: { type: String, required: true },

    gender: {
      type: String,
      enum: ["male", "female", "other"],
      required: true,
    },

    role: {
      type: String,
      enum: ["employee"],
      default: "employee",
      required: true,
    },
  },
  { timestamps: true },
);

export const EmployeeModel: Model<EmployeeDocument> =
  mongoose.model<EmployeeDocument>("Employee", EmployeeSchema);
