import { CompanyMembersDTO } from "../../dto/company/CompanyMembersDTO";

export interface IGetCompanyMemebersUseCase {
  execute(companyId: string): Promise<CompanyMembersDTO>;
}
