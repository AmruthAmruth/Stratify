import mongoose, { Schema, Document, Types, Model } from "mongoose";

export interface IDepartmentDoc extends Document {
 _id: Types.ObjectId;
  name: string;
  companyId: Types.ObjectId;
  managerId?: Types.ObjectId | null;
  description?: string;
  status?: "active" | "inactive";
  createdAt: Date;
  updatedAt: Date;
}

const DepartmentSchema = new Schema<IDepartmentDoc>(
  {
    name: { type: String, required: true },
    companyId: { type: Schema.Types.ObjectId, ref: "Company", required: true },
    managerId: { type: Schema.Types.ObjectId, ref: "Manager", default: null },
    description: { type: String },                
  status: { type: String, enum: ["active", "inactive"], default: "active" }, 
  },
  { timestamps: true }
);


const DepartmentModel: Model<IDepartmentDoc> = mongoose.model<IDepartmentDoc>(
  "Department",
  DepartmentSchema
);

export default DepartmentModel;
