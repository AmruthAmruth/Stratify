import mongoose, { Schema, Document, Types, Model } from "mongoose";

export interface IEmployeeDoc extends Document {
  name: string;
  email: string;
  phone: string;
  dob: Date;
  joiningDate: Date;
  position: string;
  managerId?: Types.ObjectId;          
  profileImage?: string;                
  departmentId: Types.ObjectId;
  companyId: Types.ObjectId;
  password: string;
  status: "active" | "inactive" | "suspended";
  role: "employee";                    
  createdAt: Date;
  updatedAt: Date;
}

const EmployeeSchema = new Schema<IEmployeeDoc>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    dob: { type: Date, required: true },
    joiningDate: { type: Date, required: true },
    position: { type: String, required: true },
    managerId: { type: Schema.Types.ObjectId, ref: "Manager" }, 
    profileImage: { type: String },                            
    departmentId: { type: Schema.Types.ObjectId, ref: "Department", required: true },
    companyId: { type: Schema.Types.ObjectId, ref: "Company", required: true },
    password: { type: String, required: true },
    status: { type: String, enum: ["active", "inactive", "suspended"], required: true },
    role: { type: String, enum: ["employee"], required: true },
  },
  { timestamps: true }
);

const EmployeeModel: Model<IEmployeeDoc> = mongoose.model<IEmployeeDoc>(
  "Employee",
  EmployeeSchema
);

export default EmployeeModel;
