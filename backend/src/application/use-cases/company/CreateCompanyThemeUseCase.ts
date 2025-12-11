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
            // Extract colors from the logo image
            const { backgroundColor, textColor } =
                await this.colorExtractionService.extractColorsFromImage(imageBuffer);

            // Check if theme already exists for this company
            const existingTheme = await this.companyThemeRepository.findByCompanyId(companyId);

            if (existingTheme) {
                // Update existing theme
                existingTheme.backgroundColor = backgroundColor;
                existingTheme.textColor = textColor;
                return await this.companyThemeRepository.update(existingTheme);
            }

            // Create new theme
            const theme = new CompanyTheme(
                undefined,
                companyId,
                backgroundColor,
                textColor
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
