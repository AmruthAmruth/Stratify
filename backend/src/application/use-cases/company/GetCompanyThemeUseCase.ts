import { ICompanyThemeRepository } from "../../../domain/repositories/ICompanyThemeRepository";
import { CompanyTheme } from "../../../domain/entities/CompanyTheme";

export interface IGetCompanyThemeUseCase {
    execute(companyId: string): Promise<CompanyTheme | null>;
}

export class GetCompanyThemeUseCase implements IGetCompanyThemeUseCase {
    constructor(private companyThemeRepository: ICompanyThemeRepository) { }

    async execute(companyId: string): Promise<CompanyTheme | null> {
        let theme = await this.companyThemeRepository.findByCompanyId(companyId);

        
        if (!theme) {
            console.log(`No theme found for company ${companyId}, creating default theme`);

            const defaultTheme = new CompanyTheme(
                undefined,
                companyId,
                'Clean Professional',
                'light',
                '#16a34a', 
                '#1f2937', 
                '#e5e7eb', 
                '#f7faf9', 
                '#1f2937', 
                '#ffffff', 
                '#e5e7eb', 
                '#6b7280', 
                '#0f172a', 
                false 
            );

            theme = await this.companyThemeRepository.create(defaultTheme);
        }

        return theme;
    }
}
