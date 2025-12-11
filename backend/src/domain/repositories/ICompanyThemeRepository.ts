import { CompanyTheme } from "../entities/CompanyTheme";

export interface ICompanyThemeRepository {
    create(theme: CompanyTheme): Promise<CompanyTheme>;
    findByCompanyId(companyId: string): Promise<CompanyTheme | null>;
    update(theme: CompanyTheme): Promise<CompanyTheme>;
    delete(companyId: string): Promise<void>;
}
