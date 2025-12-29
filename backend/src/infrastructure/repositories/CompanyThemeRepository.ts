import { ICompanyThemeRepository } from "../../domain/repositories/ICompanyThemeRepository";
import { CompanyTheme } from "../../domain/entities/CompanyTheme";
import CompanyThemeModel from "../models/CompanyThemeModel";
import mongoose from "mongoose";

export class CompanyThemeRepository implements ICompanyThemeRepository {
    async create(theme: CompanyTheme): Promise<CompanyTheme> {
        const doc = await CompanyThemeModel.create({
            companyId: theme.companyId,
            themeName: theme.themeName,
            themeMode: theme.themeMode,
            primaryColor: theme.primaryColor,
            secondaryColor: theme.secondaryColor,
            accentColor: theme.accentColor,
            backgroundColor: theme.backgroundColor,
            textColor: theme.textColor,
            surfaceColor: theme.surfaceColor,
            borderColor: theme.borderColor,
            mutedColor: theme.mutedColor,
            headingColor: theme.headingColor,
            isCustom: theme.isCustom,
        });

        return new CompanyTheme(
            (doc._id as mongoose.Types.ObjectId).toString(),
            doc.companyId,
            doc.themeName,
            doc.themeMode,
            doc.primaryColor,
            doc.secondaryColor,
            doc.accentColor,
            doc.backgroundColor,
            doc.textColor,
            doc.surfaceColor,
            doc.borderColor,
            doc.mutedColor,
            doc.headingColor,
            doc.isCustom,
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
            doc.themeName,
            doc.themeMode,
            doc.primaryColor,
            doc.secondaryColor,
            doc.accentColor,
            doc.backgroundColor,
            doc.textColor,
            doc.surfaceColor,
            doc.borderColor,
            doc.mutedColor,
            doc.headingColor,
            doc.isCustom,
            doc.createdAt,
            doc.updatedAt
        );
    }

    async update(theme: CompanyTheme): Promise<CompanyTheme> {
        const doc = await CompanyThemeModel.findOneAndUpdate(
            { companyId: theme.companyId },
            {
                themeName: theme.themeName,
                themeMode: theme.themeMode,
                primaryColor: theme.primaryColor,
                secondaryColor: theme.secondaryColor,
                accentColor: theme.accentColor,
                backgroundColor: theme.backgroundColor,
                textColor: theme.textColor,
                surfaceColor: theme.surfaceColor,
                borderColor: theme.borderColor,
                mutedColor: theme.mutedColor,
                headingColor: theme.headingColor,
                isCustom: theme.isCustom,
            },
            { new: true }
        );

        if (!doc) {
            throw new Error("CompanyTheme not found");
        }

        return new CompanyTheme(
            (doc._id as mongoose.Types.ObjectId).toString(),
            doc.companyId,
            doc.themeName,
            doc.themeMode,
            doc.primaryColor,
            doc.secondaryColor,
            doc.accentColor,
            doc.backgroundColor,
            doc.textColor,
            doc.surfaceColor,
            doc.borderColor,
            doc.mutedColor,
            doc.headingColor,
            doc.isCustom,
            doc.createdAt,
            doc.updatedAt
        );
    }

    async delete(companyId: string): Promise<void> {
        await CompanyThemeModel.deleteOne({ companyId });
    }
}
