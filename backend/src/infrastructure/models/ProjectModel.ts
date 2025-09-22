import mongoose, { Schema, Document, Types } from "mongoose";
import { ProjectStatus } from "../../domain/entities/Project";

export interface ProjectDocument extends Document {
  name: string;
  key: string;
  description: string;
  companyId: Types.ObjectId;
  departmentId: Types.ObjectId;
  createdBy: Types.ObjectId;
  createdByModel: "Company" | "Manager";
  projectLeadId: Types.ObjectId; 
  assignedEmployeeIds: Types.ObjectId[]; 
  backlogIds: Types.ObjectId[]; 
  sprintIds: Types.ObjectId[]; 
  status: ProjectStatus;
  startDate?: Date;
  endDate?: Date;
  normalizedName: string;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema = new Schema<ProjectDocument>(
  {
    name: { type: String, required: true },
    key: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    companyId: { type: Schema.Types.ObjectId, ref: "Company", required: true },
    departmentId: { type: Schema.Types.ObjectId, ref: "Department", required: true },
    createdBy: { type: Schema.Types.ObjectId, refPath: "createdByModel", required: true },
    createdByModel: { type: String, enum: ["Company", "Manager"], required: true },
    projectLeadId: { type: Schema.Types.ObjectId, ref: "Manager", required: true },
    assignedEmployeeIds: [{ type: Schema.Types.ObjectId, ref: "Employee" }],
    backlogIds: [{ type: Schema.Types.ObjectId, ref: "Backlog" }],
    sprintIds: [{ type: Schema.Types.ObjectId, ref: "Sprint" }],
    status: {
      type: String,
      enum: ["Planned", "Active", "Completed", "Archived"],
      default: "Planned",
    },
    startDate: { type: Date },
    endDate: { type: Date },
    normalizedName: { type: String, lowercase: true, default: "" },
  },
  { timestamps: true }
);


ProjectSchema.index({ companyId: 1, normalizedName: 1 }, { unique: true });


ProjectSchema.pre("save", function (next) {
  if (this.name) {
    this.normalizedName = this.name.toLowerCase().trim();
  }

  if (this.createdByModel === "Manager" && !this.projectLeadId) {
    this.projectLeadId = this.createdBy;
  }

  next();
});

export const ProjectModel = mongoose.model<ProjectDocument>("Project", ProjectSchema);
