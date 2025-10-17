import mongoose, { Document, Schema } from "mongoose";

export interface IPlanPrice extends Document {
  plan: string;
  description: string;
  amount: number;
  durationInMonths: number;
  createdAt: Date;
  updatedAt: Date;
}

const PlanPriceSchema: Schema = new Schema(
  {
    plan: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    amount: { type: Number, required: true },
    durationInMonths: { type: Number, required: true },
  },
  { timestamps: true },
);

const PlanPriceModel = mongoose.model<IPlanPrice>("PlanPrice", PlanPriceSchema);
export default PlanPriceModel;
