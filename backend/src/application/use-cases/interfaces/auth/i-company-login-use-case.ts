import { LoginDTO } from "../../../validators/login-validator";

export interface ICompanyLoginUseCase {
  execute(dto: LoginDTO): Promise<{ accessToken: string; refreshToken: string }>;
}