import { ICompanyThemeRepository } from "../../domain/repositories/ICompanyThemeRepository";
import { CompanyTheme } from "../../domain/entities/CompanyTheme";
import CompanyThemeModel from "../models/CompanyThemeModel";
import mongoose from "mongoose";

export class CompanyThemeRepository implements ICompanyThemeRepository {
    async create(theme: CompanyTheme): Promise<CompanyTheme> {
        const doc = await CompanyThemeModel.create({
            companyId: theme.companyId,
            backgroundColor: theme.backgroundColor,
            textColor: theme.textColor,
        });

        return new CompanyTheme(
            (doc._id as mongoose.Types.ObjectId).toString(),
            doc.companyId,
            doc.backgroundColor,
            doc.textColor,
            doc.createdAt,
            doc.updatedAt
        );
    }

    async findByCompanyId(companyId: string): Promise<CompanyTheme | null> {
        const doc = await CompanyThemeModel.findOne({ companyId });
        if (!doc) return null;

        return new CompanyTheme(
            (doc._id as mongoose.Types.ObjectId).toString(),
            doc.companyId,
            doc.backgroundColor,
            doc.textColor,
            doc.createdAt,
            doc.updatedAt
        );
    }

    async update(theme: CompanyTheme): Promise<CompanyTheme> {
        const doc = await CompanyThemeModel.findOneAndUpdate(
            { companyId: theme.companyId },
            {
                backgroundColor: theme.backgroundColor,
                textColor: theme.textColor,
            },
            { new: true }
        );

        if (!doc) {
            throw new Error("CompanyTheme not found");
        }

        return new CompanyTheme(
            (doc._id as mongoose.Types.ObjectId).toString(),
            doc.companyId,
            doc.backgroundColor,
            doc.textColor,
            doc.createdAt,
            doc.updatedAt
        );
    }

    async delete(companyId: string): Promise<void> {
        await CompanyThemeModel.deleteOne({ companyId });
    }
}
