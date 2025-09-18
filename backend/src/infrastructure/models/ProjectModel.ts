import mongoose, { Schema, Document, Types } from "mongoose";

export interface ProjectDocument extends Document {
  name: string;
  description: string;
  companyId: Types.ObjectId;
  createdBy: Types.ObjectId; 
  managerId?: Types.ObjectId;
  status: "Planned" | "Active" | "Completed" | "Archived";
  startDate?: Date;
  endDate?: Date;
  normalizedName: string;
  createdByModel: "Company" | "Manager"; 
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema = new Schema<ProjectDocument>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    companyId: { type: Schema.Types.ObjectId, ref: "Company", required: true },
    createdBy: { type: Schema.Types.ObjectId, refPath: "createdByModel", required: true },
    managerId: { type: Schema.Types.ObjectId, ref: "Manager" },
    status: {
      type: String,
      enum: ["Planned", "Active", "Completed", "Archived"],
      default: "Planned",
    },
    startDate: { type: Date },
    endDate: { type: Date },
    normalizedName: { type: String, lowercase: true, default: "" },
    createdByModel: { type: String, enum: ["Company", "Manager"], required: true },
  },
  { timestamps: true }
);


ProjectSchema.index({ companyId: 1, normalizedName: 1 }, { unique: true });


ProjectSchema.pre("save", function (next) {
  if (this.name) {
    this.normalizedName = this.name.toLowerCase().trim();
  }


  if (this.createdByModel === "Manager" && !this.managerId) {
    this.managerId = this.createdBy;
  }

  next();
});

export const ProjectModel = mongoose.model<ProjectDocument>(
  "Project",
  ProjectSchema
);
