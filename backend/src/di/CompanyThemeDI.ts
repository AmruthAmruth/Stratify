import { CompanyThemeController } from "../interfaces/controllers/CompanyThemeController";
import { GetCompanyThemeUseCase } from "../application/use-cases/company/GetCompanyThemeUseCase";
import { UpdateCompanyThemeUseCase } from "../application/use-cases/company/UpdateCompanyThemeUseCase";
import { GetThemePresetsUseCase } from "../application/use-cases/company/GetThemePresetsUseCase";
import { CompanyThemeRepository } from "../infrastructure/repositories/CompanyThemeRepository";

export const companyThemeDI = (): CompanyThemeController => {
    const companyThemeRepository = new CompanyThemeRepository();

    const getCompanyThemeUseCase = new GetCompanyThemeUseCase(companyThemeRepository);
    const updateCompanyThemeUseCase = new UpdateCompanyThemeUseCase(companyThemeRepository);
    const getThemePresetsUseCase = new GetThemePresetsUseCase();

    return new CompanyThemeController(
        getCompanyThemeUseCase,
        updateCompanyThemeUseCase,
        getThemePresetsUseCase
    );
};
