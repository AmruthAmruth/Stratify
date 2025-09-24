import { Request, Response } from "express";

import { IRegisterCompanyUseCase } from "../../application/interfaces/authentication/IRegisterCompanyUseCase";
import { IVerifyCompanyOTPUseCase } from "../../application/interfaces/authentication/IVerifyCompanyOTPUseCase";
import { IGetCompanyByIdUseCase } from "../../application/interfaces/company/IGetCompanyUseCase";
import { ICompanyLoginUseCase } from "../../application/interfaces/authentication/ICompanyLoginUseCase";
import { IResendOtpUseCase } from "../../application/interfaces/authentication/IResentOTPUseCase";
import { IForgotPasswordUseCase } from "../../application/interfaces/authentication/IForgotPasswordUseCase";
import { IVerifyForgotPasswordOTPUseCase } from "../../application/interfaces/authentication/IVerifyForgotPasswordOTPUseCase";
import { IResetPasswordUseCase } from "../../application/interfaces/authentication/IResetPasswordOTPUseCase";
import { IGetPaginatedCompaniesUseCase } from "../../application/interfaces/company/IListCompanyUseCase";

import { LoginDTO, LoginSchema } from "../../application/validators/LoginValidator";
import { Messages } from "../../shared/constants/messages";
import { StatusCodes } from "../../shared/constants/statusCodes";
import { CookieConfig } from "../../config/CookieConfig";
import { IApproveCompanyUseCase } from "../../application/interfaces/company/IApproveCompanyUseCase";
import { IUnapproveCompany } from "../../application/interfaces/company/IUnapprovedCompanyUseCase";
import { AuthRequest } from "../middleware/AuthMiddleware";
import { CreateManagerSchema } from "../../application/validators/CreateManager";
import { CreateEmployeeSchema } from "../../application/validators/CreateEmployee";
import { CreatePlanSchema } from "../../application/validators/CreatePlan";
import { DepartmentDetailsSchema } from "../../application/validators/CreateDepartment";
import { ICreateDepartmentUseCase } from "../../application/interfaces/departments/ICreateDepartmentUseCase";
import { ICreateManagerUseCase } from "../../application/interfaces/managers/ICreateManagerUseCase";
import { ICreateEmployeeUseCase } from "../../application/interfaces/employees/ICreateEmployeeUseCase";
import { IGetCompanyDepartmentUseCase } from "../../application/interfaces/departments/IGetCompanyDepartmentsUseCase";
import { IGetCompanyDepartmentDetailsUseCase } from "../../application/interfaces/departments/IGetDepartmentDetailsUseCase";
import { IGetCompanyMemebersUseCase } from "../../application/interfaces/company/IGetCompanyMembersUseCase";
import { IGetProfileUseCase } from "../../application/interfaces/company/IGetProfileUseCase";
import { IPurchaseSubscriptionUseCase } from "../../application/interfaces/subscriptions/IPurchaseSubscriptionUseCase";
import { IListSubscriptionPlansUseCase } from "../../application/interfaces/subscriptions/IListSubscriptionPlansUseCase";
import { IGetUnassignedDepartments } from "../../application/interfaces/departments/IGetUnassignedDepartmentsUseCase";
import { IGetManagerDepartmentsUseCase } from "../../application/interfaces/departments/IGetManagerDepartmentsUseCase";
import { IGetUnassignedManagersUseCase } from "../../application/interfaces/managers/IGetUnassignedManagersUseCase";
import { ICreateProjectUseCase } from "../../application/interfaces/project/ICreateProjectUseCase";
import { ICreateUserStoryUseCase } from "../../application/interfaces/project/ICreateUserStoryUseCase";

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
    private _createDeapartmentUseCase:ICreateDepartmentUseCase,
    private _createManagerUseCase:ICreateManagerUseCase,
    private _createEmployeeUseCase:ICreateEmployeeUseCase,
    private _getUnassignedManagersUseCase:IGetUnassignedManagersUseCase,
    private _getCompanyDepartmentsUseCase:IGetCompanyDepartmentUseCase,
    private _getDepartmentDetailsUseCase:IGetCompanyDepartmentDetailsUseCase,
    private _getCompanyMembersUseCase:IGetCompanyMemebersUseCase,
    private _getProfileOfTeamMemeber:IGetProfileUseCase,
    private _getCompany:IGetCompanyByIdUseCase,
    private _getUnassinedDepartment:IGetUnassignedDepartments,
    private _subscriptionPurchaseUseCase:IPurchaseSubscriptionUseCase,
    private _listSubscriptionPlanUseCase:IListSubscriptionPlansUseCase,
    private _getManagerDepartments:IGetManagerDepartmentsUseCase,
    private _createProject:ICreateProjectUseCase,
    private _createUserStory:ICreateUserStoryUseCase
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
  const {companyId,reason} = req.body;
  await this._unapproveCompanyUseCase.execute(companyId,reason);
  res.status(StatusCodes.OK).json({message:"Company Unapproved Successfully.!"})
}


createDepartment=async(req:AuthRequest,res:Response)=>{
 const result = DepartmentDetailsSchema.safeParse(req.body);
    
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

  const companyId=req.userId;
  const response = await this._createDeapartmentUseCase.execute({...req.body,companyId})
  return res.status(StatusCodes.CREATED).json({message:"Department Created Successfully",response})
}

 
createManager=async(req:AuthRequest,res:Response)=>{
   const result = CreateManagerSchema.safeParse(req.body);
    
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
  const companyId=req.userId;
  const response = await this._createManagerUseCase.execute({...req.body,companyId})
  return res.status(StatusCodes.CREATED).json({message:"Manager Created Successfully",response})
}

createEmployee=async(req:AuthRequest,res:Response)=>{

 const result = CreateEmployeeSchema.safeParse(req.body);
    
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

  const creatorId = req.userId! 
   const employeeDto = req.body;
  const response = await this._createEmployeeUseCase.execute(employeeDto,creatorId)
  return res.status(StatusCodes.CREATED).json({message:"Employee Created Successfully",response})
}

getUnassignedManager=async(req:AuthRequest,res:Response)=>{
  const companyId = req.userId
const managers = await this._getUnassignedManagersUseCase.execute(companyId!);
    return res.status(200).json({ managers });
}


getUnassignedDepartment=async(req:AuthRequest,res:Response)=>{
  const companyId=req.userId;
  const departments = await this._getUnassinedDepartment.execute(companyId!);
  return res.status(200).json({departments})

}

getCompanyDepartments=async(req:AuthRequest,res:Response)=>{
  const companyId= req.userId!
  const response = await this._getCompanyDepartmentsUseCase.execute(companyId)
  return res.status(StatusCodes.OK).json({response})
}


getDepartmentDetails=async(req:Request,res:Response)=>{
   const { id } = req.params;
  const response = await this._getDepartmentDetailsUseCase.execute(id);
  return res.status(StatusCodes.OK).json({response})

}


getCompanyMembers=async(req:AuthRequest,res:Response)=>{
  const companyId = req.userId
  const response = await this._getCompanyMembersUseCase.execute(companyId!)
  return res.status(StatusCodes.OK).json({response})
}


getProfileOfTeamMemeber=async(req:Request,res:Response)=>{
   const { id } = req.params;
  const response = await this._getProfileOfTeamMemeber.execute(id);
  return res.status(StatusCodes.OK).json({response})
}


getCompany=async(req:Request,res:Response)=>{
  const {id}=req.params;
  const response = await this._getCompany.execute(id);
  return res.status(StatusCodes.OK).json({response})
}


listPlans=async(_req:Request,res:Response)=>{
  const response = await this._listSubscriptionPlanUseCase.execute();
 res.status(StatusCodes.OK).json(response)
}


purchasePlan=async(req:AuthRequest,res:Response)=>{
   const result = CreatePlanSchema.safeParse(req.body);
    
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
    const companyId = req.userId!; 
  const {planName} = req.body
  console.log("Here calling");
  
  const subscription = await this._subscriptionPurchaseUseCase.execute(planName,companyId)
  res.status(StatusCodes.CREATED).json({ message: "Subscription purchased successfully", subscription });
}


verifyPayment = async (req: AuthRequest, res: Response) => {
  const companyId = req.userId!; 
  const { orderId, paymentId, signature, planName } = req.body;

   const subscription = await this._subscriptionPurchaseUseCase.verifyAndActivate(
    companyId,
    planName,
    orderId,
    paymentId,
    signature
  );

   res.status(StatusCodes.OK).json({
    message: "Payment verified & subscription activated",
    subscription,
  });
}


getDepartmentsByAManager=async (req:Request,res:Response)=>{
  const {managerId}=req.params
  const response= await this._getManagerDepartments.execute(managerId)
  return res.status(StatusCodes.OK).json(response) 
}


createSubscriptionPlanForUnauthenticated=async(req:Request,res:Response)=>{
   
  const {planName,companyId} = req.body
  console.log("Here calling");
  
  const subscription = await this._subscriptionPurchaseUseCase.execute(planName,companyId)
  res.status(StatusCodes.CREATED).json({ message: "Subscription purchased successfully", subscription });
}

verifyPaymentForUnauthenticated=async (req: Request, res: Response) => {
 
  const { orderId, paymentId, signature, planName,companyId } = req.body;

   const subscription = await this._subscriptionPurchaseUseCase.verifyAndActivate(
    companyId,
    planName,
    orderId,
    paymentId,
    signature
  );

   res.status(StatusCodes.OK).json({
    message: "Payment verified & subscription activated",
    subscription,
  });
}




createProject = async (req:AuthRequest,res:Response)=>{
  const createdBy=req.userId;
   const projectDTO = { ...req.body, createdBy };
  const response = await this._createProject.execute(projectDTO)
  return res.status(StatusCodes.CREATED).json({message:"Project Created Successfully",response})
}


createUserStory=async(req:AuthRequest,res:Response)=>{
  const createdBy=req.userId;
  const userStoryDTO={...req.body,createdBy};
  const response = await this._createUserStory.execute(userStoryDTO)
  return res.status(StatusCodes.CREATED).json({message:"User Story Created Successfully",response})
}


}
