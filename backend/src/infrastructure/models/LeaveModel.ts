import mongoose, { Schema, Document, Types } from "mongoose";

export interface LeaveDocument extends Document {
  employeeId: Types.ObjectId;
  startDate: Date;
  endDate: Date;
  type: "Casual" | "Sick" | "Earned" | "Other";
  status: "Pending" | "Approved" | "Rejected";
  reason?: string;
  month: number; 
  createdAt: Date;
  updatedAt: Date;
}

const LeaveSchema = new Schema<LeaveDocument>(
  {
    employeeId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    type: {
      type: String,
      enum: ["Casual", "Sick", "Earned", "Other"],
      default: "Casual",
    },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
    reason: { type: String },
    month: { type: Number, required: true, min: 0, max: 11 }, 
  },
  { timestamps: true }
);


export const LeaveModel = mongoose.model<LeaveDocument>("Leave", LeaveSchema);
