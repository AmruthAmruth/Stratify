import mongoose, { Schema, Document, Types } from "mongoose";

export interface TaskDocument extends Document {
  userStoryId: Types.ObjectId;
  title: string;
  description?: string;
  status: "To Do" | "In Progress" | "Done";
  assignedToId?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  normalizedTitle: string;
}

const TaskSchema = new Schema<TaskDocument>(
  {
    userStoryId: {
      type: Schema.Types.ObjectId,
      ref: "UserStory",
      required: true,
    },
    title: { type: String, required: true },
    description: { type: String },
    status: {
      type: String,
      enum: ["To Do", "In Progress", "Done"],
      default: "To Do",
    },
    assignedToId: { type: Schema.Types.ObjectId, ref: "User" },
    normalizedTitle: { type: String, lowercase: true, default: "" },
  },
  { timestamps: true },
);

TaskSchema.index({ userStoryId: 1, normalizedTitle: 1 }, { unique: true });

TaskSchema.pre("save", function (next) {
  if (this.title) {
    this.normalizedTitle = this.title.toLowerCase().trim();
  }
  next();
});

export const TaskModel = mongoose.model<TaskDocument>("Task", TaskSchema);
