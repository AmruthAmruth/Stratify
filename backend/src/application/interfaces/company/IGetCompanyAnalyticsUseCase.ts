import { CompanyAnalyticsDTO } from "../../dto/company/CompanyAnalyticsDTO";

export interface IGetCompanyAnalyticsUseCase {
    execute(companyId: string): Promise<CompanyAnalyticsDTO>;
}
