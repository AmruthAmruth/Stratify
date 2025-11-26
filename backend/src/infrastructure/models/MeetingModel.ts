import mongoose, { Schema, Document, Types } from "mongoose";

export interface MeetingDocument extends Document {
  roomId: string;
  creatorId: Types.ObjectId;
  title: string;
  status: "open" | "closed";
  projectId?: Types.ObjectId;
  isRecurring: boolean;
  scheduledDate?: Date;
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
    projectId: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: false,
    },
    isRecurring: {
      type: Boolean,
      default: false,
    },
    scheduledDate: {
      type: Date,
      required: false,
    },
  },
  { timestamps: true }
);

// Indexes for efficient queries
MeetingSchema.index({ projectId: 1, scheduledDate: 1 });
MeetingSchema.index({ scheduledDate: 1, status: 1 });

export const MeetingModel = mongoose.model<MeetingDocument>(
  "Meeting",
  MeetingSchema
);
