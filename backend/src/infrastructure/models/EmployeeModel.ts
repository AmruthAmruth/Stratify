import mongoose, { Schema, Document } from "mongoose";

export interface IEmployeeDoc extends Document {
  companyId: mongoose.Types.ObjectId;
  departmentId: mongoose.Types.ObjectId;
  managerId?: mongoose.Types.ObjectId;
  name: string;
  email: string;
  phone: string;
  position: string; 
  password: string;
  status: "active" | "inactive";
  profileImage?: string;
  role: "employee";
}

const EmployeeSchema = new Schema<IEmployeeDoc>(
  {
    companyId: { type: Schema.Types.ObjectId, ref: "Company", required: true },
    departmentId: { type: Schema.Types.ObjectId, ref: "Department", required: true },
    managerId: { type: Schema.Types.ObjectId, ref: "Manager" },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true, unique: true },
    position: { type: String, required: true },
    role: { type: String, enum: ["employee"], default: "employee" },
    password: { type: String, required: true },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
    profileImage: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model<IEmployeeDoc>("Employee", EmployeeSchema);
