import { LoginDTO } from "../../validators/LoginValidator";

export interface ICompanyLoginUseCase {
  execute(
    dto: LoginDTO,
  ): Promise<{ accessToken: string; refreshToken: string }>;
}
