import mongoose, { Schema, Document, Types } from "mongoose";

export interface DepartmentDocument extends Document {
  name: string;
  description?: string;
  companyId: Types.ObjectId;
  managerId?: Types.ObjectId;
  normalizedName: string;
  createdAt: Date;
  updatedAt: Date;
}

const DepartmentSchema = new Schema<DepartmentDocument>(
  {
    name: { type: String, required: true },
    description: { type: String },
    companyId: { type: Schema.Types.ObjectId, ref: "Company", required: true },
    managerId: { type: Schema.Types.ObjectId, ref: "Manager" },
    normalizedName: { type: String, lowercase: true, default: "" },
  },
  { timestamps: true }
);

DepartmentSchema.index({ companyId: 1, normalizedName: 1 }, { unique: true });

DepartmentSchema.pre("save", function (next) {
  if (this.name) {
    this.normalizedName = this.name.toLowerCase().trim();
  }
  next();
});

export const DepartmentModel = mongoose.model<DepartmentDocument>(
  "Department",
  DepartmentSchema
);
