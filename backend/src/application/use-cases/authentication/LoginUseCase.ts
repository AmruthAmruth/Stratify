import { ISuperAdminRepository } from "../../../domain/repositories/ISuperAdminRepository";
import { LoginDTO } from "../../dto/authentication/LoginDTO";
import { comparePassword } from "../../../shared/utils/password";
import {
  generateRefreshToken,
  generateAccessToken,
} from "../../../shared/utils/token";
import { Messages } from "../../../shared/constants/messages";
import { StatusCodes } from "../../../shared/constants/statusCodes";
import { AppError } from "../../../interfaces/middleware/ErrorMiddleware";

export class LoginUseCase {
  constructor(private _superAdminRepository: ISuperAdminRepository) { }

  async execute(
    data: LoginDTO,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const user = await this._superAdminRepository.findByEmail(data.email);
    if (!user) throw new AppError(Messages.SUPER_ADMIN_NOT_FOUND, StatusCodes.NOT_FOUND);

    const isPasswordValid = await comparePassword(data.password, user.password);
    if (!isPasswordValid) throw new AppError(Messages.LOGIN_FAILED, StatusCodes.UNAUTHORIZED);

    const payload = { id: user.id, role: "superAdmin" };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    return { accessToken, refreshToken };
  }
}
