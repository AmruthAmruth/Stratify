import mongoose, { Schema, Document, Types, Model } from "mongoose";

export interface IManagerDoc extends Document {
  name: string;
  email: string;
  phone: string;
  password: string;
  role: string;
  status: string;
  departmentId: Types.ObjectId;
  companyId: Types.ObjectId;
  joiningDate?: string;        
  profileImage?: string;
  createdAt: Date;
  updatedAt: Date;
}



const ManagerSchema = new Schema<IManagerDoc>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, required: true },
    status: { type: String, required: true },
    departmentId: { type: Schema.Types.ObjectId, ref: "Department", required: true },
    companyId: { type: Schema.Types.ObjectId, ref: "Company", required: true },
     joiningDate: { type: String },         
    profileImage: { type: String },  
  },
  { timestamps: true }
);

const ManagerModel: Model<IManagerDoc> = mongoose.model<IManagerDoc>(
  "Manager",
  ManagerSchema
);

export default ManagerModel;