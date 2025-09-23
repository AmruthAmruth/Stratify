import mongoose, { Schema, Document, Types } from "mongoose";

export interface ProjectDocument extends Document {
  name: string;
  key: string;
  description: string;
  startDate: Date;
  endDate: Date;
  status: "Planned" | "Active" | "Completed" | "Archived";
  departmentId: Types.ObjectId;
  projectLeadId: Types.ObjectId;
  createdBy: Types.ObjectId;
  createdByModel: "Company" | "Manager";
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema = new Schema<ProjectDocument>(
  {
    name: { type: String, required: true },
    key: { type: String, required: true },
    description: { type: String ,required: true},
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    status: {
      type: String,
      enum: ["Planned", "Active", "Completed", "Archived"],
      default: "Planned",
    },
    departmentId: { type: Schema.Types.ObjectId, ref: "Department", required: true },
    projectLeadId: { type: Schema.Types.ObjectId, ref: "Manager", required: true },
    createdBy: {
      type: Schema.Types.ObjectId,
      required: true,
      refPath: "createdByModel",
    },
    createdByModel: {
      type: String,
      required: true,
      enum: ["Company", "Manager"], 
    },
  },
  { timestamps: true }
);

ProjectSchema.index({ departmentId: 1, key: 1 }, { unique: true });


ProjectSchema.pre("save", function (next) {
  if (this.key) {
    this.key = this.key.toUpperCase().trim();
  }
  next();
});

export const ProjectModel = mongoose.model<ProjectDocument>("Project", ProjectSchema);
