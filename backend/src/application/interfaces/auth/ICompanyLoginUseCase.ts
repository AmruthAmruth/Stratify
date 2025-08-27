import { LoginDTO } from "../../dto/auth/LoginSchema";

export interface ICompanyLoginUseCase {
  execute(dto: LoginDTO): Promise<{ accessToken: string; refreshToken: string }>;
}