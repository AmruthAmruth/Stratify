import mongoose, { Schema, Document, Types } from "mongoose";

export interface SprintDocument extends Document {
  name: string;
  description: string;
  projectId: Types.ObjectId;
  startDate: Date;
  endDate: Date;
  status: "Planned" | "Active" | "Completed";
  teamCapacity: number;
  totalStoryPoints: number;
  createdBy: Types.ObjectId;
  userStoryIds: Types.ObjectId[]; 
  createdAt: Date;
  updatedAt: Date;
}

const SprintSchema = new Schema<SprintDocument>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    projectId: { type: Schema.Types.ObjectId, ref: "Project", required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    status: {
      type: String,
      enum: ["Planned", "Active", "Completed"],
      default: "Planned",
    },
    teamCapacity: { type: Number, required: true },
    totalStoryPoints: { type: Number, default: 0 },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    userStoryIds: [{ type: Schema.Types.ObjectId, ref: "UserStory", default: [] }], 
  },
  { timestamps: true }
);


export const SprintModel = mongoose.model<SprintDocument>(
  "Sprint",
  SprintSchema
);
