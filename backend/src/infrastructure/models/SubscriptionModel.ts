import mongoose, { Document, Schema } from "mongoose";

export interface SubscriptionDocument extends Document {
  companyId: string;
  startDate: Date;
  endDate: Date;
  status: "active" | "expired" | "trial" | "cancelled";
  plan: string;
  amount: number;
  paymentId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const SubscriptionSchema = new Schema<SubscriptionDocument>(
  {
    companyId: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    status: {
      type: String,
      enum: ["active", "expired", "trial", "cancelled"],
      required: true,
    },
    plan: { type: String, required: true },
    amount: { type: Number, required: true },
    paymentId: { type: String },
  },
  { timestamps: true }
);

const SubscriptionModel = mongoose.model<SubscriptionDocument>(
  "Subscription",
  SubscriptionSchema
);

export default SubscriptionModel;
