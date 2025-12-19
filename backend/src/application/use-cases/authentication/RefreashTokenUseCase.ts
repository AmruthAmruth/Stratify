import { AppError } from "../../../interfaces/middleware/ErrorMiddleware";
import { StatusCodes } from "../../../shared/constants/statusCodes";
import { Messages } from "../../../shared/constants/messages";
import {
  verifyRefreshToken,
  TokenPayload,
  generateAccessToken,
  generateRefreshToken,
} from "../../../shared/utils/token";

export class RefreshTokenUseCase {
  async execute(
    refreshToken: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      const decoded = verifyRefreshToken(refreshToken) as TokenPayload;
      const payload: TokenPayload = { id: decoded.id, role: decoded.role };
      const accessToken = generateAccessToken(payload);
      const newRefreashToken = generateRefreshToken(payload);
      return { accessToken, refreshToken: newRefreashToken };
    } catch {
      throw new AppError(Messages.INVALID_REFRESH_TOKEN, StatusCodes.UNAUTHORIZED);
    }
  }
}
 