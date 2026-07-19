import { RefreshTokenResponseDTO } from "../../dto/authentication/RefreshTokenResponseDTO";

export interface IRefreashTokenUseCase {
  execute(token: string): Promise<RefreshTokenResponseDTO>;
}
