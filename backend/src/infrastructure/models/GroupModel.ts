import mongoose, { Schema, Document } from "mongoose";

export interface IGroupDocument extends Document {
  name: string;
  members: string[];
  departmentId?: Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const GroupSchema = new Schema<IGroupDocument>(
  {
    name: { type: String, required: true },
    members: [{ type: String, required: true }],
    departmentId: { type: Schema.Types.ObjectId, ref: "Department" },
  },
  { timestamps: true }
);

export default mongoose.model<IGroupDocument>("Group", GroupSchema);
