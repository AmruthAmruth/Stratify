import mongoose, { Schema, Document, Types } from "mongoose";

export interface MeetingDocument extends Document {
  roomId: string;
  creatorId: Types.ObjectId;
  title: string;
  status: "open" | "closed";
  createdAt: Date;
  updatedAt: Date;
}

const MeetingSchema = new Schema<MeetingDocument>(
  {
    roomId: {
      type: String,
      required: true,
    },
    creatorId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Manager",
    },
    title: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["open", "closed"],
      default: "open",
    },
  },
  { timestamps: true }
);

export const MeetingModel = mongoose.model<MeetingDocument>(
  "Meeting",
  MeetingSchema
);
