import mongoose, { Document, Schema } from "mongoose";

export interface ISuperAdmin extends Document {
  name?: string;
  profileImage?: string;
  email: string;
  password: string;
  createdAt: Date;
}

const SuperAdminSchema: Schema = new Schema(
  {
    email: { type: String, require: true, unique: true, lowercase: true },
    password: { type: String, require: true },
    name: { type: String },
    profileImage: { type: String },
  },
  { timestamps: true },
);

const SuperAdminModel = mongoose.model<ISuperAdmin>(
  "SuperAdmin",
  SuperAdminSchema,
);
export default SuperAdminModel;
