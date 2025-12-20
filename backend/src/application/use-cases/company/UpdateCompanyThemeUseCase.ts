import { ICompanyThemeRepository } from "../../../domain/repositories/ICompanyThemeRepository";
import { CompanyTheme, ThemeMode } from "../../../domain/entities/CompanyTheme";
import { AppError } from "../../../interfaces/middleware/ErrorMiddleware";
import { StatusCodes } from "../../../shared/constants/statusCodes";

export interface UpdateThemeDTO {
    themeName: string;
    themeMode: ThemeMode;
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    backgroundColor?: string;
    textColor?: string;
    isCustom?: boolean;
}

export interface IUpdateCompanyThemeUseCase {
    execute(companyId: string, themeData: UpdateThemeDTO): Promise<CompanyTheme>;
}

export class UpdateCompanyThemeUseCase implements IUpdateCompanyThemeUseCase {
    constructor(private _companyThemeRepository: ICompanyThemeRepository) { }

    async execute(companyId: string, themeData: UpdateThemeDTO): Promise<CompanyTheme> {
        const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;

        // Validate all color fields
        const colorFields = ['primaryColor', 'secondaryColor', 'accentColor'] as const;
        for (const field of colorFields) {
            if (!hexColorRegex.test(themeData[field])) {
                throw new AppError(
                    `Invalid ${field} format. Please provide a valid hex color (e.g., #3B82F6)`,
                    StatusCodes.BAD_REQUEST
                );
            }
        }

        // Check if theme exists for this company
        const existingTheme = await this._companyThemeRepository.findByCompanyId(companyId);

        if (!existingTheme) {
            // Create new theme
            const newTheme = new CompanyTheme(
                undefined,
                companyId,
                themeData.themeName,
                themeData.themeMode,
                themeData.primaryColor,
                themeData.secondaryColor,
                themeData.accentColor,
                themeData.backgroundColor || '#FFFFFF',
                themeData.textColor || '#000000',
                themeData.isCustom ?? false
            );
            return await this._companyThemeRepository.create(newTheme);
        }

        // Update existing theme
        existingTheme.themeName = themeData.themeName;
        existingTheme.themeMode = themeData.themeMode;
        existingTheme.primaryColor = themeData.primaryColor;
        existingTheme.secondaryColor = themeData.secondaryColor;
        existingTheme.accentColor = themeData.accentColor;
        if (themeData.backgroundColor) existingTheme.backgroundColor = themeData.backgroundColor;
        if (themeData.textColor) existingTheme.textColor = themeData.textColor;
        existingTheme.isCustom = themeData.isCustom ?? existingTheme.isCustom;

        return await this._companyThemeRepository.update(existingTheme);
    }
}
