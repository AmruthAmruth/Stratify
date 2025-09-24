import mongoose, { Schema, Document, Types } from "mongoose";

export interface SprintDocument extends Document {
  name: string;
  projectId: Types.ObjectId;
  startDate: Date;
  endDate: Date;
  goal?: string;
  status: "Planned" | "Active" | "Completed";
  createdAt: Date;
  updatedAt: Date;
}

const SprintSchema = new Schema<SprintDocument>(
  {
    name: { type: String, required: true },
    projectId: { type: Schema.Types.ObjectId, ref: "Project", required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    goal: { type: String },
    status: { type: String, enum: ["Planned", "Active", "Completed"], default: "Planned" },
  },
  { timestamps: true }
);


SprintSchema.index({ projectId: 1, name: 1 }, { unique: true });

export const SprintModel = mongoose.model<SprintDocument>("Sprint", SprintSchema);
