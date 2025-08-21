import { LoginUseCase } from "../../application/use-cases/super-admin/LoginUseCase";
import { LoginDTO } from "../../application/dto/auth/LoginDTO";
import { Request, Response } from "express";
import { StatusCodes } from "../../shared/constants/statusCodes";
import { Messages } from "../../shared/constants/messages";
import { LoginSchema } from "../../application/dto/auth/LoginSchema";
import { RefreshTokenUseCase } from "../../application/use-cases/super-admin/RefreshTokenUseCase";
import { CookieConfig } from "../../config/cookieConfig";

export class SuperAdminController {
  constructor(
    private readonly _loginUseCase: LoginUseCase,
    private readonly _refreshTokenUseCase: RefreshTokenUseCase
  ) {}

  login = async (req: Request, res: Response) => {
    const result = LoginSchema.safeParse(req.body);

    if (!result.success) {
      res.status(StatusCodes.BAD_REQUEST).json({
        status: Messages.LOGIN_FAILED,
        errors: result.error.issues.map(issue => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      });
      return;
    }

    const dto: LoginDTO = {
      email: req.body.email,
      password: req.body.password,
    };

    const { accessToken, refreshToken } = await this._loginUseCase.execute(dto);

    res.cookie("refreshToken", refreshToken, CookieConfig);

    res.status(StatusCodes.OK).json({
      status: Messages.LOGIN_SUCCESS,
      accessToken,
    });
  };


  logout=async(_req:Request,res:Response)=>{
    res.clearCookie("refreshToken", CookieConfig);
    res.status(StatusCodes.OK).json({ message: "Logout successful" });
  }

  refresh = async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      res.status(StatusCodes.UNAUTHORIZED).json({
        message: Messages.NO_REFREASHTOKEN,
      });
      return;
    }

    const { accessToken, refreshToken: newRefreshToken } =
      await this._refreshTokenUseCase.execute(refreshToken);

    res.cookie("refreshToken", newRefreshToken, CookieConfig);

    res.json({ accessToken });
  };
}
