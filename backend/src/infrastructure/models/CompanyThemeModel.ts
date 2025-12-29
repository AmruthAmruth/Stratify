import mongoose, { Schema, Document } from "mongoose";

export interface ICompanyThemeDoc extends Document {
    companyId: string;
    themeName: string;
    themeMode: 'light' | 'dark';
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    backgroundColor: string;
    textColor: string;
    surfaceColor: string;
    borderColor: string;
    mutedColor: string;
    headingColor: string;
    isCustom: boolean;
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
        themeName: {
            type: String,
            required: true,
            default: "Clean Professional"
        },
        themeMode: {
            type: String,
            enum: ['light', 'dark'],
            default: 'light'
        },
        primaryColor: {
            type: String,
            required: true,
            default: "#16a34a"
        },
        secondaryColor: {
            type: String,
            required: true,
            default: "#1f2937"
        },
        accentColor: {
            type: String,
            required: true,
            default: "#e5e7eb"
        },
        backgroundColor: {
            type: String,
            required: true,
            default: "#f7faf9"
        },
        textColor: {
            type: String,
            required: true,
            default: "#1f2937"
        },
        surfaceColor: {
            type: String,
            required: true,
            default: "#ffffff"
        },
        borderColor: {
            type: String,
            required: true,
            default: "#e5e7eb"
        },
        mutedColor: {
            type: String,
            required: true,
            default: "#6b7280"
        },
        headingColor: {
            type: String,
            required: true,
            default: "#0f172a"
        },
        isCustom: {
            type: Boolean,
            default: false
        },
    },
    { timestamps: true }
);

export default mongoose.model<ICompanyThemeDoc>("CompanyTheme", CompanyThemeSchema);
