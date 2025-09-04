import { Request, Response } from "express";

import { IRegisterCompanyUseCase } from "../../application/interfaces/auth/i-register-company-use-case";
import { IVerifyCompanyOTPUseCase } from "../../application/interfaces/auth/i-verify-company-otp-use-case";
import { IGetCompanyByIdUseCase } from "../../application/interfaces/company/i-get-company-by-id-use-case";
import { ICompanyLoginUseCase } from "../../application/interfaces/auth/i-company-login-use-case";
import { IResendOtpUseCase } from "../../application/interfaces/auth/i-resent-otp-use-case";
import { IForgotPasswordUseCase } from "../../application/interfaces/auth/i-forgot-password-use-case";
import { IVerifyForgotPasswordOTPUseCase } from "../../application/interfaces/auth/i-verify-forgotpassword-use-case";
import { IResetPasswordUseCase } from "../../application/interfaces/auth/i-reset-password-use-case";
import { IGetPaginatedCompaniesUseCase } from "../../application/interfaces/company/i-get-paginated-company-use-case";
import { IAddDepartmentWithManagerUseCase } from "../../application/interfaces/company/i-add-department-with-manager-use-case";

import { LoginDTO, LoginSchema } from "../../application/validators/login-validator";
import { Messages } from "../../shared/constants/messages";
import { StatusCodes } from "../../shared/constants/statusCodes";
import { CookieConfig } from "../../config/cookieConfig";
import { AuthRequest } from "../middleware/auth-middleware";
import { ICreateEmployeeUseCase } from "../../application/interfaces/company/i-create-employee-use-case";
import { IApproveCompanyUseCase } from "../../application/interfaces/company/i-approve-company";
import { IUnapproveCompany } from "../../application/interfaces/company/i-unapprove-compnay-use-case";
import { IGetAllDepartmentByCompanyId } from "../../application/interfaces/company/i-get-all-department-by-company-id-use-case";
import { IGetAllEmployeeByCompanyIdUseCase } from "../../application/interfaces/company/i-get-employee-by-company-id-use-case";
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
    private _addDepartmentWithManagerUseCase: IAddDepartmentWithManagerUseCase,
    private _createEmployeeUseCase : ICreateEmployeeUseCase,
    private _approveCompanyUseCase:IApproveCompanyUseCase,
    private _unapproveCompanyUseCase:IUnapproveCompany,
    private _getAllDepartmentByCompanyId:IGetAllDepartmentByCompanyId,
    private _getAllEmployeeByCompanyId:IGetAllEmployeeByCompanyIdUseCase
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

createEmployee = async(req:Request,res:Response)=>{

  const result = await this._createEmployeeUseCase.execute(req.body)
  res.status(StatusCodes.CREATED).json({message:"Employee Created Successfully",data:result})
}


approveCompany=async(req:Request,res:Response)=>{
  const { companyId } = req.body;
  await this._approveCompanyUseCase.execute(companyId)
  res.status(StatusCodes.OK).json({message:"Company Approved Successfully.!"})
}


unapproveCompany=async(req:Request,res:Response)=>{
  const {companyId} = req.body;
  await this._unapproveCompanyUseCase.execute(companyId);
  res.status(StatusCodes.OK).json({message:"Company Unapproved Successfully.!"})
}


getDepartmentDetailsInACompany = async (req: AuthRequest, res: Response) => {
  const companyId = req.companyId

  if (!companyId) {
    
    throw { status: 400, message: "Company ID is missing" };
  }

  const response = await this._getAllDepartmentByCompanyId.execute(companyId);

  return res.status(StatusCodes.OK).json({
    message: "Department details fetched successfully",
    data: response
  });
};



getAllEmployeeByCompanyId = async (req: AuthRequest, res: Response) => {
  
    const companyId = req.companyId;

    if (!companyId) {
      return res.status(400).json({ message: "Company ID is missing" });
    }

    const employees = await this._getAllEmployeeByCompanyId.execute(companyId);

    return res.status(200).json({
      message: "Employee details fetched successfully",
      data: employees,
    });
  
};


}
 