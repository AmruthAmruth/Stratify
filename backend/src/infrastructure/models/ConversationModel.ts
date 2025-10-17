import mongoose, { Schema, Document, Types } from "mongoose";

export interface ConversationDocument extends Document {
  isGroup: boolean;
  name?: string;
  members: Types.ObjectId[];
  lastMessage?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ConversationSchema = new Schema<ConversationDocument>(
  {
    isGroup: { type: Boolean, default: false },
    name: { type: String },
    members: [{ type: Schema.Types.ObjectId, ref: "Employee", required: true }],
    lastMessage: { type: String },
    createdAt: { type: Date, required: true, default: () => new Date() },
    updatedAt: { type: Date, required: true, default: () => new Date() },
  },
  { timestamps: true },
);

ConversationSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

export const ConversationModel = mongoose.model<ConversationDocument>(
  "Conversation",
  ConversationSchema,
);
