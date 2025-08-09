
import mongoose,{Schema,Document} from "mongoose";

export interface ICompanyDocument extends Document{
  name: string;
  email: string;
  phone: string;
  industry: string;
  description: string;
  businessRegNo: string;
  address: string;
  city: string;
  state: string;
  country: string;
  zipcode: string;
  password: string;
  profileImage?: string;
  status: "pending" | "approved" | "rejected"; 
}

const CompanySchema = new Schema<ICompanyDocument>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  industry: { type: String, required: true },
  description: { type: String, required: true },
  businessRegNo: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  country: { type: String, required: true },
  zipcode: { type: String, required: true },
  password: { type: String, required: true },
  profileImage: { type: String, required: false },
    status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
    required: true,
  } 
},{
     timestamps: true
})


export const CompanyModel = mongoose.model<ICompanyDocument>("Company",CompanySchema)