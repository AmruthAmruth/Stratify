import mongoose, { Schema, Document } from "mongoose";

export interface ICompanyThemeDoc extends Document {
    companyId: string;
    backgroundColor: string;
    textColor: string;
    createdAt: Date;
    updatedAt: Date;
}

const CompanyThemeSchema = new Schema<ICompanyThemeDoc>(
    {
        companyId: {
            type: String,
            required: true,
            unique: true,
            index: true
        },
        backgroundColor: {
            type: String,
            required: true,
            default: "#3B82F6"
        },
        textColor: {
            type: String,
            required: true,
            default: "#FFFFFF"
        },
    },
    { timestamps: true }
);

export default mongoose.model<ICompanyThemeDoc>("CompanyTheme", CompanyThemeSchema);
