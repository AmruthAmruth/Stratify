import mongoose, { Schema, Document, Types } from "mongoose";

export interface NotificationDocument extends Document {
  userId: Types.ObjectId; 
  role: "company" | "manager" | "employee"; 
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const NotificationSchema = new Schema<NotificationDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      refPath: "role", 
    },
    role: {
      type: String,
      required: true,
      enum: ["company", "manager", "employee"],
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: {
      type: String,
      enum: ["info", "success", "warning", "error"],
      default: "info",
    },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const NotificationModel = mongoose.model<NotificationDocument>(
  "Notification",
  NotificationSchema
);
