import { Request, Response } from "express";
import { IRegisterCompanyUseCase } from "../../application/interfaces/authentication/IRegisterCompanyUseCase";
import { IVerifyCompanyOTPUseCase } from "../../application/interfaces/authentication/IVerifyCompanyOTPUseCase";
import { ICompanyLoginUseCase } from "../../application/interfaces/authentication/ICompanyLoginUseCase";
import { IResendOtpUseCase } from "../../application/interfaces/authentication/IResentOTPUseCase";
import { IForgotPasswordUseCase } from "../../application/interfaces/authentication/IForgotPasswordUseCase";
import { IVerifyForgotPasswordOTPUseCase } from "../../application/interfaces/authentication/IVerifyForgotPasswordOTPUseCase";
import { IResetPasswordUseCase } from "../../application/interfaces/authentication/IResetPasswordOTPUseCase";
import {
  LoginDTO,
} from "../../application/validators/LoginValidator";
import { Messages } from "../../shared/constants/messages";
import { StatusCodes } from "../../shared/constants/statusCodes";
import { CookieConfig } from "../../config/CookieConfig";
import { ILoginUseCase } from "../../application/interfaces/authentication/ILoginUseCase";
import { IRefreashTokenUseCase } from "../../application/interfaces/authentication/IRefreashTokenUseCase";
import logger from "../../shared/utils/logger";
import { agentLog } from "../../shared/utils/agentDebugLog";

interface MulterRequest extends Request {
  file?: Express.Multer.File;
}

export class AuthenticationController {
  constructor(
    private _registerUseCase: IRegisterCompanyUseCase,
    private _verifyOtpUseCase: IVerifyCompanyOTPUseCase,
    private _loginUseCase: ICompanyLoginUseCase,
    private _resendOtpUseCase: IResendOtpUseCase,
    private _forgotPasswordUseCase: IForgotPasswordUseCase,
    private _verifyForgotPasswordOtpUseCase: IVerifyForgotPasswordOTPUseCase,
    private _resetPasswordUseCase: IResetPasswordUseCase,
    private _superAdminLoginUseCase: ILoginUseCase,
    private _refreshTokenUseCase: IRefreashTokenUseCase,
  ) { }

  refresh = async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken;
    // #region agent log
    agentLog("A", "AuthenticationController.ts:refresh", "refresh-token request", {
      origin: req.headers.origin ?? null,
      hasRefreshCookie: Boolean(refreshToken),
      cookieNames: Object.keys(req.cookies || {}),
      cookieConfigSameSite: CookieConfig.sameSite,
      cookieConfigSecure: CookieConfig.secure,
      NODE_ENV: process.env.NODE_ENV ?? null,
      acaoWillDependOnCorsMiddleware: true,
    });
    // #endregion
    if (!refreshToken) {
      // #region agent log
      agentLog("A", "AuthenticationController.ts:refresh", "401 missing refresh cookie", {
        origin: req.headers.origin ?? null,
        hypothesis: "cookie not sent (SameSite/Secure) or never set",
      });
      // #endregion
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



  superAdminLogin = async (req: Request, res: Response): Promise<void> => {
    const dto: LoginDTO = {
      email: req.body.email,
      password: req.body.password,
    };

    const { accessToken, refreshToken } =
      await this._superAdminLoginUseCase.execute(dto);
    res.cookie("refreshToken", refreshToken, CookieConfig);
    res.status(StatusCodes.OK).json({
      status: Messages.LOGIN_SUCCESS,
      accessToken,
    });
  };

  register = async (req: MulterRequest, res: Response): Promise<void> => {
    try {
      logger.info("Registration request received");

      if (req.file) {
        logger.debug("File uploaded", {
          filename: req.file.filename,
          size: req.file.size,
          mimetype: req.file.mimetype,
        });
        req.body.profileImage = req.file.path;
      }

      logger.debug("Executing registration use case");
      const otpExpiresAt = await this._registerUseCase.execute(req.body);

      logger.info("Registration successful, OTP sent");
      res
        .status(StatusCodes.OK)
        .json({ message: Messages.OTP_SENT, time: otpExpiresAt });
    } catch (error) {
      logger.error("Registration error", { error });
      throw error;
    }
  };

  verifyOtp = async (req: Request, res: Response): Promise<void> => {
    const { email, otp } = req.body;
    await this._verifyOtpUseCase.execute(email, otp);
    res
      .status(StatusCodes.CREATED)
      .json({ message: Messages.REGISTER_SUCCESS });
  };

  resendOtp = async (req: Request, res: Response): Promise<void> => {
    const { email } = req.body;
    await this._resendOtpUseCase.execute(email);
    res.status(StatusCodes.OK).json({ message: Messages.OTP_RESENT });
  };

  login = async (req: Request, res: Response): Promise<void> => {
    const dto: LoginDTO = {
      email: req.body.email,
      password: req.body.password,
    };
    const { accessToken, refreshToken, companyId, theme } = await this._loginUseCase.execute(dto);
    // #region agent log
    agentLog("B", "AuthenticationController.ts:login", "Setting refreshToken cookie on login", {
      origin: req.headers.origin ?? null,
      cookieConfig: {
        httpOnly: CookieConfig.httpOnly,
        secure: CookieConfig.secure,
        sameSite: CookieConfig.sameSite,
        maxAge: CookieConfig.maxAge,
      },
      NODE_ENV: process.env.NODE_ENV ?? null,
      note: "Cross-site needs SameSite=None; Secure=true",
    });
    // #endregion
    res.cookie("refreshToken", refreshToken, CookieConfig);
    res
      .status(StatusCodes.OK)
      .json({ accessToken, companyId, theme, message: Messages.LOGIN_SUCCESS });
  };

  logout = async (_req: Request, res: Response): Promise<void> => {
    res.clearCookie("refreshToken", CookieConfig);
    res.status(StatusCodes.OK).json({ message: Messages.LOGOUT_SUCCESS });
  };

  forgotPassword = async (req: Request, res: Response): Promise<void> => {
    const { email } = req.body;
    const otpExpiresAt = await this._forgotPasswordUseCase.execute(email);
    res
      .status(StatusCodes.OK)
      .json({ message: Messages.OTP_SENT, time: otpExpiresAt });
  };

  verifyForgotPasswordOtp = async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    const { email, otp } = req.body;
    await this._verifyForgotPasswordOtpUseCase.execute(email, otp);
    res.status(StatusCodes.OK).json({ message: Messages.OTP_VERIFIED });
  };

  resetPassword = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;
    await this._resetPasswordUseCase.execute(email, password);
    res
      .status(StatusCodes.OK)
      .json({ message: Messages.PASSWORD_RESET_SUCCESS });
  };
}
