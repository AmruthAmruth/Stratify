import { Company } from "../../../domain/entities/Company";
import { RegisterCompanyDTO } from "../../dto/company/CreateCompanyDTO";

export interface IRegisterCompanyUseCase {
 execute(data: RegisterCompanyDTO | Company): Promise<Date>;
}

