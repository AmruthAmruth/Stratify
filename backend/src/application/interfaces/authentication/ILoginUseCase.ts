import { LoginDTO } from "../../validators/LoginValidator";

export interface ILoginUseCase {
  execute(
    data: LoginDTO,
  ): Promise<{ accessToken: string; refreshToken: string }>;
}
