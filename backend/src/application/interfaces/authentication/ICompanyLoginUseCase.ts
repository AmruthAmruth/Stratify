import { LoginDTO } from "../../dto/authentication/LoginDTO";
import { LoginResponseDTO } from "../../dto/authentication/LoginResponseDTO";

export interface ICompanyLoginUseCase {
  execute(dto: LoginDTO): Promise<LoginResponseDTO>;
}
