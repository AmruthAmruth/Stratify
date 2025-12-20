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
            default: "#009063"
        },
        secondaryColor: {
            type: String,
            required: true,
            default: "#3b3b3b"
        },
        accentColor: {
            type: String,
            required: true,
            default: "#dfdcef"
        },
        backgroundColor: {
            type: String,
            required: true,
            default: "#fbfbfb"
        },
        textColor: {
            type: String,
            required: true,
            default: "#3b3b3b"
        },
        isCustom: {
            type: Boolean,
            default: false
        },
    },
    { timestamps: true }
);

export default mongoose.model<ICompanyThemeDoc>("CompanyTheme", CompanyThemeSchema);
