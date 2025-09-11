import { Request, Response } from "express";

import { IRegisterCompanyUseCase } from "../../application/interfaces/auth/IRegisterCompanyUseCase";
import { IVerifyCompanyOTPUseCase } from "../../application/interfaces/auth/IVerifyCompanyOTPUseCase";
import { IGetCompanyByIdUseCase } from "../../application/interfaces/company/IGetCompanyUseCase";
import { ICompanyLoginUseCase } from "../../application/interfaces/auth/ICompanyLoginUseCase";
import { IResendOtpUseCase } from "../../application/interfaces/auth/IResentOTPUseCase";
import { IForgotPasswordUseCase } from "../../application/interfaces/auth/IForgotPasswordUseCase";
import { IVerifyForgotPasswordOTPUseCase } from "../../application/interfaces/auth/IVerifyForgotPasswordOTPUseCase";
import { IResetPasswordUseCase } from "../../application/interfaces/auth/IResetPasswordOTPUseCase";
import { IGetPaginatedCompaniesUseCase } from "../../application/interfaces/company/IListCompanyUseCase";

import { LoginDTO, LoginSchema } from "../../application/validators/LoginValidator";
import { Messages } from "../../shared/constants/messages";
import { StatusCodes } from "../../shared/constants/statusCodes";
import { CookieConfig } from "../../config/CookieConfig";
import { IApproveCompanyUseCase } from "../../application/interfaces/company/IApproveCompanyUseCase";
import { IUnapproveCompany } from "../../application/interfaces/company/IUnapprovedCompanyUseCase";
import { CreateDepartmentUseCase } from "../../application/use-cases/company/CreateDepartmentUseCase";
import { AuthRequest } from "../middleware/AuthMiddleware";
import { CreateManagerUseCase } from "../../application/use-cases/company/CreateManagerUseCase";
import { CreateEmployeeUseCase } from "../../application/use-cases/company/CreateEmployeeUseCase";
import { GetUnassignedManagersUseCase } from "../../application/use-cases/company/GetUnassignedManagersUseCase";
import { GetCompanyDepartmentUseCase } from "../../application/use-cases/company/GetCompanyDepartmentsUseCase";
import { GetDepartmentDetailsUseCase } from "../../application/use-cases/company/GetDepartmentDetailsUseCase";
import { GetCompanyMemebersUseCase } from "../../application/use-cases/company/GetCompanyMembersUseCase";
import { GetProfileUseCase } from "../../application/use-cases/company/GetProfileUseCase";
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
    private _approveCompanyUseCase:IApproveCompanyUseCase,
    private _unapproveCompanyUseCase:IUnapproveCompany,
    private _createDeapartmentUseCase:CreateDepartmentUseCase,
    private _createManagerUseCase:CreateManagerUseCase,
    private _createEmployeeUseCase:CreateEmployeeUseCase,
    private _getUnassignedManagersUseCase:GetUnassignedManagersUseCase,
    private _getCompanyDepartmentsUseCase:GetCompanyDepartmentUseCase,
    private _getDepartmentDetailsUseCase:GetDepartmentDetailsUseCase,
    private _getCompanyMembersUseCase:GetCompanyMemebersUseCase,
    private _getProfileOfTeamMemeber:GetProfileUseCase
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


createDepartment=async(req:AuthRequest,res:Response)=>{
  const companyId=req.companyId;
  const response = await this._createDeapartmentUseCase.execute({...req.body,companyId})
  return res.status(StatusCodes.CREATED).json({message:"Department Created Successfully",response})
}


createManager=async(req:AuthRequest,res:Response)=>{
  const companyId=req.companyId;
  const response = await this._createManagerUseCase.execute({...req.body,companyId})
  return res.status(StatusCodes.CREATED).json({message:"Manager Created Successfully",response})
}

createEmployee=async(req:AuthRequest,res:Response)=>{
  const creatorId = req.companyId! 
   const employeeDto = req.body;
  const response = await this._createEmployeeUseCase.execute(employeeDto,creatorId)
  return res.status(StatusCodes.CREATED).json({message:"Employee Created Successfully",response})
}

getUnassignedManager=async(_req:Request,res:Response)=>{
const managers = await this._getUnassignedManagersUseCase.execute();
    return res.status(200).json({ managers });
}

getCompanyDepartments=async(req:AuthRequest,res:Response)=>{
  const companyId= req.companyId!
  const response = await this._getCompanyDepartmentsUseCase.execute(companyId)
  return res.status(StatusCodes.OK).json({response})
}


getDepartmentDetails=async(req:Request,res:Response)=>{
  const {departmentId} = req.body
  const response = await this._getDepartmentDetailsUseCase.execute(departmentId);
  return res.status(StatusCodes.OK).json({response})

}


getCompanyMembers=async(req:AuthRequest,res:Response)=>{
  const companyId = req.companyId
  const response = await this._getCompanyMembersUseCase.execute(companyId!)
  return res.status(StatusCodes.OK).json({response})
}


getProfileOfTeamMemeber=async(req:Request,res:Response)=>{
  const {id}=req.body
  const response = await this._getProfileOfTeamMemeber.execute(id);
  return res.status(StatusCodes.OK).json({response})
}

}
