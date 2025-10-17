import mongoose, { Schema, Document, Types } from "mongoose";

export interface UserStoryDocument extends Document {
  title: string;
  description: string;
  projectId: Types.ObjectId;
  backlogId?: Types.ObjectId;
  createdBy: Types.ObjectId;
  priority: "Low" | "Medium" | "High";
  status: "Backlog" | "To Do" | "In Progress" | "Done";
  storyPoints: number;
  sprintId?: Types.ObjectId;
  assignedToIds?: Types.ObjectId[];
  acceptanceCriteria?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserStorySchema = new Schema<UserStoryDocument>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    projectId: { type: Schema.Types.ObjectId, ref: "Project", required: true },
    backlogId: { type: Schema.Types.ObjectId, ref: "Backlog" },
    createdBy: { type: Schema.Types.ObjectId, required: true },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium",
    },
    status: {
      type: String,
      enum: ["Backlog", "To Do", "In Progress", "Done"],
      default: "Backlog",
    },
    storyPoints: { type: Number, required: true },
    sprintId: { type: Schema.Types.ObjectId, ref: "Sprint" },
    assignedToIds: [{ type: Schema.Types.ObjectId, ref: "Employee" }],
    acceptanceCriteria: { type: String },
  },
  { timestamps: true },
);

UserStorySchema.index({ projectId: 1, title: 1 }, { unique: true });

UserStorySchema.pre("save", function (next) {
  if (this.title) this.title = this.title.trim();
  next();
});

export const UserStoryModel = mongoose.model<UserStoryDocument>(
  "UserStory",
  UserStorySchema,
);
