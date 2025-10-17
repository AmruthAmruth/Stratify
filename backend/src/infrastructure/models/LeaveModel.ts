import mongoose, { Schema, Document, Types } from "mongoose";

export interface LeaveDocument extends Document {
  employeeId: Types.ObjectId;
  startDate: Date;
  endDate: Date;
  type: "Casual" | "Sick" | "Earned" | "Other";
  status: "Pending" | "Approved" | "Rejected";
  reason?: string;
  rejectedReason?: string;
  month: number;
  departmentId: Types.ObjectId;
  companyId: Types.ObjectId;
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
    rejectedReason: { type: String }, // <-- Added this field
    month: { type: Number, required: true, min: 0, max: 11 },
    departmentId: {
      type: Schema.Types.ObjectId,
      ref: "Department",
      required: true,
    },
    companyId: { type: Schema.Types.ObjectId, ref: "Company", required: true },
  },
  { timestamps: true },
);

export const LeaveModel = mongoose.model<LeaveDocument>("Leave", LeaveSchema);
