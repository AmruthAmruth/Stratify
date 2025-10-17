import { Schema, model, Document } from "mongoose";

interface OTPDoc extends Document {
  email: string;
  code: string;
  expiresAt: Date;
}

const OTPSchema = new Schema<OTPDoc>({
  email: { type: String, required: true },
  code: { type: String, required: true },
  expiresAt: { type: Date, required: true },
});

export default model<OTPDoc>("OTP", OTPSchema);
