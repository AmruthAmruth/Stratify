import { LoginDTO } from "../../validators/LoginValidator";
import { CompanyTheme } from "../../../domain/entities/CompanyTheme";

export interface ICompanyLoginUseCase {
  execute(
    dto: LoginDTO,
  ): Promise<{ accessToken: string; refreshToken: string; companyId: string; theme: CompanyTheme | null }>;
}
