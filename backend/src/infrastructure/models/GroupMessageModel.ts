import mongoose, { Schema, Document } from "mongoose";

export enum MessageType {
  TEXT = "text",
  IMAGE = "image",
  DOCUMENT = "document",
  VIDEO = "video",
  AUDIO = "audio"
}

export interface IGroupMessageDocument extends Document {
  groupId: string;
  senderId: string;
  message: string;
  messageType?: MessageType;
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  mimeType?: string;
  createdAt: Date;
  updatedAt: Date;
}

const GroupMessageSchema = new Schema<IGroupMessageDocument>(
  {
    groupId: { type: String, required: true },
    senderId: { type: String, required: true },
    message: { type: String, default: "" },
    messageType: {
      type: String,
      enum: Object.values(MessageType),
      default: MessageType.TEXT
    },
    fileUrl: { type: String },
    fileName: { type: String },
    fileSize: { type: Number },
    mimeType: { type: String }
  },
  { timestamps: true }
);

export default mongoose.model<IGroupMessageDocument>("GroupMessage", GroupMessageSchema);
