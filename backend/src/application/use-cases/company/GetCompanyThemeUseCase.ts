import { ICompanyThemeRepository } from "../../../domain/repositories/ICompanyThemeRepository";
import { CompanyTheme } from "../../../domain/entities/CompanyTheme";

export interface IGetCompanyThemeUseCase {
    execute(companyId: string): Promise<CompanyTheme | null>;
}

export class GetCompanyThemeUseCase implements IGetCompanyThemeUseCase {
    constructor(private companyThemeRepository: ICompanyThemeRepository) { }

    async execute(companyId: string): Promise<CompanyTheme | null> {
        let theme = await this.companyThemeRepository.findByCompanyId(companyId);

        // If no theme exists, create a default one
        if (!theme) {
            console.log(`No theme found for company ${companyId}, creating default theme`);

            const defaultTheme = new CompanyTheme(
                undefined,
                companyId,
                'Clean Professional',
                'light',
                '#009063', // Green - Primary (CTAs and highlights)
                '#3b3b3b', // Dark gray - Secondary (text and elements)
                '#dfdcef', // Light purple - Accent (borders and subtle accents)
                '#fbfbfb', // Off-white - Background
                '#3b3b3b', // Dark gray - Text color
                false // Not custom
            );

            theme = await this.companyThemeRepository.create(defaultTheme);
        }

        return theme;
    }
}
