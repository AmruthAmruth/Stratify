import { Company } from "../../../domain/entities/Company";
import { RegisterCompanyDTO } from "../../dto/company/register-company-dto";

export interface IRegisterCompanyUseCase {
 execute(data: RegisterCompanyDTO | Company): Promise<Date>;
}

