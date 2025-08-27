import { Request, Response } from "express";

import { IRegisterCompanyUseCase } from "../../application/interfaces/auth/IRegisterCompanyUseCase";
import { IVerifyCompanyOTPUseCase } from "../../application/interfaces/auth/IVerifyCompanyOTPUseCase";
import { IGetCompanyByIdUseCase } from "../../application/interfaces/company/IGetCompanyByIdUseCase";
import { ICompanyLoginUseCase } from "../../application/interfaces/auth/ICompanyLoginUseCase";
import { IResendOtpUseCase } from "../../application/interfaces/auth/IResendOtpUseCase";
import { IForgotPasswordUseCase } from "../../application/interfaces/auth/IForgotPasswordUseCase";
import { IVerifyForgotPasswordOTPUseCase } from "../../application/interfaces/auth/IVerifyForgotPasswordOTPUseCase";
import { IResetPasswordUseCase } from "../../application/interfaces/auth/IResetPasswordUseCase";
import { IGetPaginatedCompaniesUseCase } from "../../application/interfaces/company/IGetPaginatedCompaniesUseCase";
import { IAddDepartmentWithManagerUseCase } from "../../application/interfaces/company/IAddDepartmentWithManagerUseCase";

import { LoginDTO, LoginSchema } from "../../application/dto/auth/LoginSchema";
import { Messages } from "../../shared/constants/messages";
import { StatusCodes } from "../../shared/constants/statusCodes";
import { CookieConfig } from "../../config/cookieConfig";
import { AuthRequest } from "../middleware/authMiddleware";

interface MulterRequest extends Request {
  file?: Express.Multer.File;
}

export class CompanyController {
  constructor(
    private _registerUseCase: IRegisterCompanyUseCase,
    private _verifyUseCase: IVerifyCompanyOTPUseCase,
    private _getCompanyByIdUseCase: IGetCompanyByIdUseCase,
    private _companyLoginUseCase: ICompanyLoginUseCase,
    private _resendOtpUseCase: IResendOtpUseCase,
    private _forgotPasswordUseCase: IForgotPasswordUseCase,
    private _verifyForgotPasswordOTPUseCase: IVerifyForgotPasswordOTPUseCase,
    private _resetPasswordUseCase: IResetPasswordUseCase,
    private _getPaginatedCompaniesUseCase: IGetPaginatedCompaniesUseCase,
    private _addDepartmentWithManagerUseCase: IAddDepartmentWithManagerUseCase
  ) {}

  register = async (req: MulterRequest, res: Response) => {
    if (req.file) req.body.profileImage = req.file.path;
    const otpExpiresAt = await this._registerUseCase.execute(req.body);
    res.status(StatusCodes.OK).json({ message: Messages.OTP_SENT, time: otpExpiresAt });
  };

  verifyOTP = async (req: Request, res: Response) => {
    const { email, otp } = req.body;
    const { accessToken, refreshToken } = await this._verifyUseCase.execute(email, otp);
    res.cookie("refreshToken", refreshToken, CookieConfig);
    res.status(StatusCodes.CREATED).json({ accessToken, message: Messages.REGISTER_SUCCESS });
  };

  resendOtp = async (req: Request, res: Response) => {
    const { email } = req.body;
    await this._resendOtpUseCase.execute(email);
    res.status(StatusCodes.OK).json({ message: Messages.OTP_RESENT });
  };

  login = async (req: Request, res: Response) => {
    const result = LoginSchema.safeParse(req.body);
    if (!result.success) {
      res.status(StatusCodes.BAD_REQUEST).json({
        status: "error",
        errors: result.error.issues.map(issue => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      });
      return;
    }

    const dto: LoginDTO = { email: req.body.email, password: req.body.password };
    const { accessToken, refreshToken } = await this._companyLoginUseCase.execute(dto);

    res.cookie("refreshToken", refreshToken, CookieConfig);
    res.status(StatusCodes.OK).json({ accessToken, message: Messages.LOGIN_SUCCESS });
  };

  logout = async (_req: Request, res: Response) => {
    res.clearCookie("refreshToken", CookieConfig);
    res.status(StatusCodes.OK).json({ message: "Logout successful" });
  };

  forgotPassword = async (req: Request, res: Response) => {
    const { email } = req.body;
    const otpExpiresAt = await this._forgotPasswordUseCase.execute(email);
    res.status(StatusCodes.OK).json({ message: Messages.OTP_SENT, time: otpExpiresAt });
  };

  verifyForgotPasswordOTP = async (req: Request, res: Response) => {
    const { email, otp } = req.body;
    await this._verifyForgotPasswordOTPUseCase.execute(email, otp);
    res.status(StatusCodes.OK).json({ message: Messages.OTP_VERIFIED });
  };

  resetPassword = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    await this._resetPasswordUseCase.execute(email, password);
    res.status(StatusCodes.OK).json({ message: Messages.PASSWORD_RESET_SUCCESS });
  };

  getCompanyById = async (req: Request, res: Response) => {
    const { id } = req.params;
    const company = await this._getCompanyByIdUseCase.execute(id);
    res.status(StatusCodes.OK).json(company);
  };

  getPaginatedCompanies = async (req: Request, res: Response) => {
    const { page, pageSize, cursor, filter, sort } = req.query;
    const result = await this._getPaginatedCompaniesUseCase.execute({
      page: page ? Number(page) : undefined,
      pageSize: pageSize ? Number(pageSize) : undefined,
      cursor: cursor as string,
      filter: filter ? JSON.parse(filter as string) : undefined,
      sort: sort ? JSON.parse(sort as string) : undefined,
    });
    res.status(StatusCodes.OK).json(result);
  };

  createDepartmentWithManager = async (req: AuthRequest, res: Response) => {
  const data = { ...req.body, companyId: req.companyId }; 

  const result = await this._addDepartmentWithManagerUseCase.execute(data);

  res.status(StatusCodes.CREATED).json({
    message: "Department created successfully",
    data: result
  });
};



}
