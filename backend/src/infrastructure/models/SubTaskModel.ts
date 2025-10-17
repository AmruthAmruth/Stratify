import mongoose, { Schema, Document, Types } from "mongoose";

export interface SubTaskDocument extends Document {
  issueId: Types.ObjectId;
  heading: string;
  description: string;
  hours: number;
  status: "To Do" | "In Progress" | "Done" | "Blocked";
  assignedToId?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const SubTaskSchema = new Schema<SubTaskDocument>(
  {
    issueId: { type: Schema.Types.ObjectId, ref: "Issue", required: true },
    heading: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    hours: { type: Number, required: true },
    status: {
      type: String,
      enum: ["To Do", "In Progress", "Done", "Blocked"],
      default: "To Do",
    },
    assignedToId: { type: Schema.Types.ObjectId, ref: "User", default: null },
  },
  { timestamps: true },
);

export const SubTaskModel = mongoose.model<SubTaskDocument>(
  "SubTask",
  SubTaskSchema,
);
