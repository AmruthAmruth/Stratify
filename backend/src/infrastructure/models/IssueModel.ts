import mongoose, { Schema, Document, Types } from "mongoose";

export interface IssueDocument extends Document {
  heading: string;
  description: string;
  acceptanceCriteria: string;
  size: number;
  estimatedHours: number;
  type: "User Story" | "Bug";
  status: "Planned" | "In Progress" | "Done" | "Blocked";
  priority: "Low" | "Medium" | "High";
  projectId: Types.ObjectId;
  sprintId?: Types.ObjectId | null;
  assignedTo?: Types.ObjectId | null;
  createdAt: Date;
  updatedAt: Date;
}

const IssueSchema = new Schema<IssueDocument>(
  {
    heading: { type: String, required: true },
    description: { type: String, required: true },
    acceptanceCriteria: { type: String, required: true },
    size: { type: Number, required: true },
    estimatedHours: { type: Number, required: true },
    type: { type: String, enum: ["User Story", "Bug"], required: true },
    status: {
      type: String,
      enum: ["Planned", "In Progress", "Done", "Blocked"],
      default: "Planned",
    },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      required: true,
    },
    projectId: { type: Schema.Types.ObjectId, ref: "Project", required: true },
    sprintId: { type: Schema.Types.ObjectId, ref: "Sprint", default: null },
    assignedTo: { type: Schema.Types.ObjectId, ref: "User", default: null },
  },
  { timestamps: true },
);

export const IssueModel = mongoose.model<IssueDocument>("Issue", IssueSchema);
