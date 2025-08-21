import { Request, Response } from "express";
import { RegisterCompanyUseCase } from "../../application/use-cases/company/RegisterCompanyUseCase";
import { VerifyCompanyOTPUseCase } from "../../application/use-cases/company/VerifyCompanyOTPUseCase";
import { GetAllCompnayUseCase } from "../../application/use-cases/company/GetAllCompaniesUseCase";
import { GetCompanyByIdUseCase } from "../../application/use-cases/company/GetCompanyByIdUseCase";
import { CompanyLoginUseCase } from "../../application/use-cases/company/CompanyLoginUseCase";
import { LoginDTO, LoginSchema } from "../../application/dto/auth/LoginSchema";
import { Messages } from "../../shared/constants/messages";
import { StatusCodes } from "../../shared/constants/statusCodes";
import { CookieConfig } from "../../config/cookieConfig";

interface MulterRequest extends Request {
  file?: Express.Multer.File;
}

export class CompanyController {
  constructor(
    private _registerUseCase: RegisterCompanyUseCase,
  private _verifyUseCase: VerifyCompanyOTPUseCase,
  private _getAllCompanyUseCase: GetAllCompnayUseCase,
  private _getCompanyByIdUseCase: GetCompanyByIdUseCase,
  private _companyLoginUseCase: CompanyLoginUseCase
  ) {}

  register = async (req: MulterRequest, res: Response) => {
    try {
      if (req.file) {
        req.body.profileImage = req.file.path;
      }
    const otpTime=  await this._registerUseCase.execute(req.body);
      res.status(StatusCodes.OK).json({ message: Messages.OTP_SENT,time:otpTime });
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
      } else {
        res.status(StatusCodes.BAD_REQUEST).json({ error: String(error) });
      }
    }
  };

  verifyOTP = async (req: Request, res: Response) => {
    try {
      const { email, otp } = req.body;
      const { accessToken, refreshToken } = await this._verifyUseCase.execute(email, otp);
       
      res.cookie("refreshToken",refreshToken,CookieConfig)

      res.status(StatusCodes.CREATED).json({ accessToken, message: Messages.REGISTER_SUCCESS });
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
      } else {
        res.status(StatusCodes.BAD_REQUEST).json({ error: String(error) });
      }
    }
  };


 login = async (req: Request, res: Response) => {
  try {
    const result = LoginSchema.safeParse(req.body);

    if (!result.success) {
      res.status(StatusCodes.BAD_REQUEST).json({
        status: "error",
        errors: result.error.issues.map(issue => ({
          field: issue.path.join("."),
          message: issue.message
        }))
      });
      return;
    }

    const dto: LoginDTO = {
      email: req.body.email,
      password: req.body.password,
    };

    const { accessToken, refreshToken } = await this._companyLoginUseCase.execute(dto);

    res.cookie("refreshToken", refreshToken,CookieConfig);

    res.status(StatusCodes.OK).json({ accessToken, message: Messages.LOGIN_SUCCESS });

  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
    } else {
      res.status(StatusCodes.BAD_REQUEST).json({ error: String(error) });
    }
  }
};

logout = async (_req: Request, res: Response) => {
  try {
    res.clearCookie("refreshToken", CookieConfig);
    res.status(StatusCodes.OK).json({ message: "Logout successful" });
  } catch (error) {
    if (error instanceof Error) {
      res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
    } else {
      res.status(StatusCodes.BAD_REQUEST).json({ error: String(error) });
    }
  }
};



  getAllCompanies=async(_req:Request,res:Response)=>{
    try{
const companies = await this._getAllCompanyUseCase.execute()
res.status(200).json(companies);
    }catch(error:unknown){
      if (error instanceof Error) {
        res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
      } else {
        res.status(StatusCodes.BAD_REQUEST).json({ error: String(error) });
      }
    }
  }


  getCompanyById=async(req:Request,res:Response)=>{
    try{
      const {id} = req.params
     const company =  await this._getCompanyByIdUseCase.execute(id);
     res.status(StatusCodes.OK).json(company)
    }catch(error){
       if (error instanceof Error) {
        res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
      } else {
        res.status(StatusCodes.BAD_REQUEST).json({ error: String(error) });
      }
    }
  }




}
