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
                '#16a34a', // Primary - Green
                '#1f2937', // Secondary - Dark gray
                '#e5e7eb', // Accent - Light gray
                '#f7faf9', // Background - Off-white
                '#1f2937', // Text - Dark gray
                '#ffffff', // Surface - White
                '#e5e7eb', // Border - Light gray
                '#6b7280', // Muted - Medium gray
                '#0f172a', // Heading - Very dark
                false // Not custom
            );

            theme = await this.companyThemeRepository.create(defaultTheme);
        }

        return theme;
    }
}
