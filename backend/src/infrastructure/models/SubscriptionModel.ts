
import mongoose, { Document, Schema } from "mongoose";

interface ISubscriptionDoc extends Document {
  companyId: string;
  startDate: Date;
  endDate: Date;
  status: string;
  plan: string;
  amount: number;
  paymentId?: string;
}

const SubscriptionSchema = new Schema(
  {
    companyId: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    status: { type: String, required: true },
    plan: { type: String, required: true },
    amount: { type: Number, required: true },
    paymentId: { type: String },
  },
  { timestamps: true }
);

const SubscriptionModel = mongoose.model<ISubscriptionDoc>("Subscription", SubscriptionSchema);
export default SubscriptionModel