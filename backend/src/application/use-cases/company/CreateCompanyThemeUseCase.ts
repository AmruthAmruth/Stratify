import { ICompanyThemeRepository } from "../../../domain/repositories/ICompanyThemeRepository";
import { CompanyTheme } from "../../../domain/entities/CompanyTheme";
import { ColorExtractionService } from "../../../infrastructure/services/ColorExtractionService";
import { AppError } from "../../../interfaces/middleware/ErrorMiddleware";
import { StatusCodes } from "../../../shared/constants/statusCodes";

export interface ICreateCompanyThemeUseCase {
    execute(companyId: string, imageBuffer: Buffer): Promise<CompanyTheme>;
}

export class CreateCompanyThemeUseCase implements ICreateCompanyThemeUseCase {
    constructor(
        private companyThemeRepository: ICompanyThemeRepository,
        private colorExtractionService: ColorExtractionService
    ) { }

    async execute(companyId: string, imageBuffer: Buffer): Promise<CompanyTheme> {
        try {
            const { backgroundColor, textColor } =
                await this.colorExtractionService.extractColorsFromImage(imageBuffer);

            const existingTheme = await this.companyThemeRepository.findByCompanyId(companyId);

            if (existingTheme) {
                existingTheme.backgroundColor = backgroundColor;
                existingTheme.textColor = textColor;
                return await this.companyThemeRepository.update(existingTheme);
            }

            // Create new theme with extracted colors as primary
            const theme = new CompanyTheme(
                undefined,
                companyId,
                'Custom Theme',         // themeName
                'light',                 // themeMode
                backgroundColor,         // primaryColor - use extracted color
                textColor,              // secondaryColor
                backgroundColor,         // accentColor
                '#FFFFFF',              // backgroundColor
                textColor,              // textColor
                true                    // isCustom - true since extracted from image
            );

            return await this.companyThemeRepository.create(theme);
        } catch (error) {
            console.error("Error creating company theme:", error);
            throw new AppError(
                "Failed to create company theme",
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    }
}
