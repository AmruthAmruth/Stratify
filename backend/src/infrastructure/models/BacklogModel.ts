import mongoose, { Schema, Document, Types } from "mongoose";

export interface BacklogDocument extends Document {
  projectId: Types.ObjectId;
  name: string;
  description: string;
  createdBy: Types.ObjectId;
  normalizedName: string;
  createdAt: Date;
  updatedAt: Date;
}

const BacklogSchema = new Schema<BacklogDocument>(
  {
    projectId: { type: Schema.Types.ObjectId, ref: "Project", required: true },
    name: { type: String, required: true },
    description: { type: String },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    normalizedName: { type: String, lowercase: true, default: "" },
  },
  { timestamps: true },
);

BacklogSchema.index({ projectId: 1, normalizedName: 1 }, { unique: true });

BacklogSchema.pre("save", function (next) {
  if (this.name) {
    this.normalizedName = this.name.toLowerCase().trim();
  }
  next();
});

export const BacklogModel = mongoose.model<BacklogDocument>(
  "Backlog",
  BacklogSchema,
);
