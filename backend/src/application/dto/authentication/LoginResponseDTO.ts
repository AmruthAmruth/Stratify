import { CompanyTheme } from "../../../domain/entities/CompanyTheme";

export interface LoginResponseDTO {
  accessToken: string;
  refreshToken: string;
  companyId?: string;
  theme?: CompanyTheme | null;
}
