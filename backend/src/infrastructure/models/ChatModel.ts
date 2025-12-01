import mongoose, { Schema, Document } from "mongoose";

export enum MessageType {
  TEXT = "text",
  IMAGE = "image",
  DOCUMENT = "document",
  VIDEO = "video",
  AUDIO = "audio"
}

interface IChatDocument extends Document {
  senderId: string;
  receiverId: string;
  message: string;
  isRead: boolean;
  messageType?: MessageType;
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  mimeType?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ChatSchema = new Schema<IChatDocument>(
  {
    senderId: { type: String, required: true },
    receiverId: { type: String, required: true },
    message: { type: String, default: "" },
    isRead: { type: Boolean, default: false },
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

export default mongoose.model<IChatDocument>("Chat", ChatSchema);