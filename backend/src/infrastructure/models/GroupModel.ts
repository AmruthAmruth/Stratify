import mongoose, { Schema, Document } from "mongoose";

export interface IGroupDocument extends Document {
  name: string;
  members: string[]; 
  createdAt: Date;
  updatedAt: Date;
}

const GroupSchema = new Schema<IGroupDocument>(
  {
    name: { type: String, required: true },
    members: [{ type: String, required: true }],
  },
  { timestamps: true }
);

export default mongoose.model<IGroupDocument>("Group", GroupSchema);
