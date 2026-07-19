import { LoginDTO } from "../../dto/authentication/LoginDTO";
import { RefreshTokenResponseDTO } from "../../dto/authentication/RefreshTokenResponseDTO";

export interface ILoginUseCase {
  execute(data: LoginDTO): Promise<RefreshTokenResponseDTO>;
}
