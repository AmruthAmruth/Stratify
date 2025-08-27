import { ISuperAdminRepository } from "../../../domain/repositories/i-super-admin-repository";
import { LoginDTO } from "../../dto/auth/login-dto";
import { comparePassword } from "../../../shared/utils/password";
import { generateRefreshToken, generateAccessToken } from "../../../shared/utils/token";
import { Messages } from "../../../shared/constants/messages";

export class LoginUseCase {
  constructor(private _superAdminRepository: ISuperAdminRepository) {}

  async execute(data: LoginDTO): Promise<{ accessToken: string; refreshToken: string }> {
    
    const user = await this._superAdminRepository.findByEmail(data.email);
    if (!user) throw new Error("Super Admin not found");

    const isPasswordValid = await comparePassword(data.password, user.password);
    if (!isPasswordValid) throw new Error(Messages.LOGIN_FAILED);

    const payload = { id: user.id, role: "superAdmin" };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    return { accessToken, refreshToken };
  }
}






