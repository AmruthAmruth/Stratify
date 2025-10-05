import mongoose, { Schema, Document, Types } from "mongoose";

export interface SprintDocument extends Document {
  name: string;
  goal: string;
  startDate: Date;
  endDate: Date;
  projectId: Types.ObjectId;
  status: "Planned" | "Active" | "Completed";
  createdAt: Date;
  updatedAt: Date;
}

const SprintSchema = new Schema<SprintDocument>(
  {
    name: { type: String, required: true },
    goal: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    projectId: { type: Schema.Types.ObjectId, ref: "Project", required: true },
    status: {
      type: String,
      enum: ["Planned", "Active", "Completed"],
      default: "Planned",
    },
  },
  { timestamps: true }
);


export const SprintModel = mongoose.model<SprintDocument>("Sprint", SprintSchema);
