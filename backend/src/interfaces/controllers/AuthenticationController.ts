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
  LoginSchema,
} from "../../application/validators/LoginValidator";
import { Messages } from "../../shared/constants/messages";
import { StatusCodes } from "../../shared/constants/statusCodes";
import { CookieConfig } from "../../config/CookieConfig";
import { ILoginUseCase } from "../../application/interfaces/authentication/ILoginUseCase";
import { IRefreashTokenUseCase } from "../../application/interfaces/authentication/IRefreashTokenUseCase";

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
  ) {}

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

  superAdminLogin = async (req: Request, res: Response): Promise<void> => {
    const result = LoginSchema.safeParse(req.body);
    if (!result.success) {
      res.status(StatusCodes.BAD_REQUEST).json({
        status: Messages.LOGIN_FAILED,
        errors: result.error.issues.map((issue) => ({
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

    const { accessToken, refreshToken } =
      await this._superAdminLoginUseCase.execute(dto);
    res.cookie("refreshToken", refreshToken, CookieConfig);
    res.status(StatusCodes.OK).json({
      status: Messages.LOGIN_SUCCESS,
      accessToken,
    });
  };

  register = async (req: MulterRequest, res: Response): Promise<void> => {
    if (req.file) req.body.profileImage = req.file.path;
    const otpExpiresAt = await this._registerUseCase.execute(req.body);
    res
      .status(StatusCodes.OK)
      .json({ message: Messages.OTP_SENT, time: otpExpiresAt });
  };

  verifyOtp = async (req: Request, res: Response): Promise<void> => {
    const { email, otp } = req.body;
    const { accessToken, refreshToken } = await this._verifyOtpUseCase.execute(
      email,
      otp,
    );
    res.cookie("refreshToken", refreshToken, CookieConfig);
    res
      .status(StatusCodes.CREATED)
      .json({ accessToken, message: Messages.REGISTER_SUCCESS });
  };

  resendOtp = async (req: Request, res: Response): Promise<void> => {
    const { email } = req.body;
    await this._resendOtpUseCase.execute(email);
    res.status(StatusCodes.OK).json({ message: Messages.OTP_RESENT });
  };

  login = async (req: Request, res: Response): Promise<void> => {
    const result = LoginSchema.safeParse(req.body);
    if (!result.success) {
      res.status(StatusCodes.BAD_REQUEST).json({
        status: "error",
        errors: result.error.issues.map((issue) => ({
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
    res
      .status(StatusCodes.OK)
      .json({ accessToken, message: Messages.LOGIN_SUCCESS });
  };

  logout = async (_req: Request, res: Response): Promise<void> => {
    res.clearCookie("refreshToken", CookieConfig);
    res.status(StatusCodes.OK).json({ message: "Logout successful" });
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
