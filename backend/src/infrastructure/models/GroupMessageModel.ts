import mongoose, { Schema, Document } from "mongoose";

export interface IGroupMessageDocument extends Document {
  groupId: string;
  senderId: string;
  message: string;
  createdAt: Date;
  updatedAt: Date;
}

const GroupMessageSchema = new Schema<IGroupMessageDocument>(
  {
    groupId: { type: String, required: true },
    senderId: { type: String, required: true },
    message: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IGroupMessageDocument>("GroupMessage", GroupMessageSchema);
