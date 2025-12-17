import mongoose, { Schema, Document } from "mongoose";

export interface IForecastAllocationDocument extends Document {
    employeeId: mongoose.Types.ObjectId;
    projectId: mongoose.Types.ObjectId;
    forecastHoursPerWeek: number;
    startDate: Date;
    endDate: Date | null;
    status: "Active" | "Completed" | "Cancelled";
    notes?: string;
    createdBy: mongoose.Types.ObjectId;
    createdByModel: "Company" | "Manager";
    companyId: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const ForecastAllocationSchema = new Schema<IForecastAllocationDocument>(
    {
        employeeId: {
            type: Schema.Types.ObjectId,
            ref: "Employee",
            required: true,
            index: true,
        },
        projectId: {
            type: Schema.Types.ObjectId,
            ref: "Project",
            required: true,
            index: true,
        },
        forecastHoursPerWeek: {
            type: Number,
            required: true,
            min: 0,
            max: 168, // Max hours in a week
        },
        startDate: {
            type: Date,
            required: true,
            index: true,
        },
        endDate: {
            type: Date,
            default: null,
            index: true,
        },
        status: {
            type: String,
            enum: ["Active", "Completed", "Cancelled"],
            default: "Active",
            index: true,
        },
        notes: {
            type: String,
            default: undefined,
        },
        createdBy: {
            type: Schema.Types.ObjectId,
            required: true,
            refPath: "createdByModel",
        },
        createdByModel: {
            type: String,
            enum: ["Company", "Manager"],
            required: true,
        },
        companyId: {
            type: Schema.Types.ObjectId,
            ref: "Company",
            required: true,
            index: true,
        },
    },
    {
        timestamps: true,
    },
);

// Compound indexes for efficient queries
ForecastAllocationSchema.index({ employeeId: 1, startDate: 1, endDate: 1 });
ForecastAllocationSchema.index({ projectId: 1, status: 1 });
ForecastAllocationSchema.index({ companyId: 1, status: 1 });

export const ForecastAllocationModel = mongoose.model<IForecastAllocationDocument>(
    "ForecastAllocation",
    ForecastAllocationSchema,
);
