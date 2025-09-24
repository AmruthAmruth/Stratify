import mongoose, { Schema, Document, Types } from "mongoose";

export interface UserStoryDocument extends Document {
  title: string;
  description: string;
  projectId: Types.ObjectId;                 
  createdBy: Types.ObjectId;                  
  priority: "Low" | "Medium" | "High";
  status: "To Do" | "In Progress" | "Done";
  storyPoints: number;                        
  capacity: number;   
sprintId?: string;                         
  assignedTo?: Types.ObjectId;                
  createdAt: Date;
  updatedAt: Date;
}

const UserStorySchema = new Schema<UserStoryDocument>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    projectId: { type: Schema.Types.ObjectId, ref: "Project", required: true },
    createdBy: { type: Schema.Types.ObjectId, required: true },
    priority: { type: String, enum: ["Low", "Medium", "High"], default: "Medium" },
    status: { type: String, enum: ["To Do", "In Progress", "Done"], default: "To Do" },
    storyPoints: { type: Number, required: true },
    capacity: { type: Number, required: true },
    sprintId:{type: Schema.Types.ObjectId, ref: "Sprint"},
    assignedTo: { type: Schema.Types.ObjectId, ref: "Employee" },
  },
  { timestamps: true }
);


UserStorySchema.index({ projectId: 1, title: 1 }, { unique: true });

export const UserStoryModel = mongoose.model<UserStoryDocument>(
  "UserStory",
  UserStorySchema
);
