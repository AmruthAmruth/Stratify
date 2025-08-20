import { ISuperAdminRepository } from "../../../domain/repositories/ISuperAdminRepository";
import { LoginDTO } from "../../dto/auth/LoginDTO";
import { comparePassword } from "../../../shared/utils/passwordHash";
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






