import { ICompanyRepository } from "../../../domain/repositories/ICompanyRepository";
import { Company } from "../../../domain/entities/Company";
import { AppError } from "../../../interfaces/middleware/ErrorMiddleware";
import { StatusCodes } from "../../../shared/constants/statusCodes";
import { Messages } from "../../../shared/constants/messages";

export interface IUpdateCompanyThemeUseCase {
    execute(companyId: string, themeColor: string): Promise<Company>;
}

export class UpdateCompanyThemeUseCase implements IUpdateCompanyThemeUseCase {
    constructor(private _companyRepository: ICompanyRepository) { }

    async execute(companyId: string, themeColor: string): Promise<Company> {
        // Validate hex color format
        const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
        if (!hexColorRegex.test(themeColor)) {
            throw new AppError(
                "Invalid color format. Please provide a valid hex color (e.g., #3B82F6)",
                StatusCodes.BAD_REQUEST
            );
        }

        const company = await this._companyRepository.findById(companyId);

        if (!company) {
            throw new AppError(Messages.COMPANY_NOT_FOUND, StatusCodes.NOT_FOUND);
        }

        // Update theme color
        company.themeColor = themeColor;

        return await this._companyRepository.update(company);
    }
}
