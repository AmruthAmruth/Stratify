import { Request, Response } from "express";
import { RegisterCompanyUseCase } from "../../application/use-cases/company/RegisterCompanyUseCase";
import { VerifyCompanyOTPUseCase } from "../../application/use-cases/company/VerifyCompanyOTPUseCase";
import { GetAllCompnayUseCase } from "../../application/use-cases/company/GetAllCompaniesUseCase";
import { GetCompanyByIdUseCase } from "../../application/use-cases/company/GetCompanyByIdUseCase";
import { CompanyLoginUseCase } from "../../application/use-cases/company/CompanyLoginUseCase";
import { LoginDTO, LoginSchema } from "../../application/dto/auth/LoginSchema";

interface MulterRequest extends Request {
  file?: Express.Multer.File;
}

export class CompanyController {
  constructor(
    private registerUseCase: RegisterCompanyUseCase,
    private verifyUseCase: VerifyCompanyOTPUseCase,
    private getAllCompanyUseCase:GetAllCompnayUseCase,
    private getCompanyByIdUseCase:GetCompanyByIdUseCase,
    private companyLoginUseCase:CompanyLoginUseCase
  ) {}

  register = async (req: MulterRequest, res: Response) => {
    try {
      if (req.file) {
        req.body.profileImage = req.file.path;
      }
      await this.registerUseCase.execute(req.body);
      res.status(200).json({ message: "OTP sent to email" });
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(400).json({ error: String(error) });
      }
    }
  };

  verifyOTP = async (req: Request, res: Response) => {
    try {
      const { email, otp } = req.body;
      const { accessToken, refreshToken } = await this.verifyUseCase.execute(email, otp);
       
      res.cookie("refreshToken",refreshToken,{
      httpOnly:true,
      secure: process.env.NODE_ENV === "production", 
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      })

      res.status(201).json({ accessToken, message: "Company registered successfully" });
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(400).json({ error: String(error) });
      }
    }
  };


 login = async (req: Request, res: Response) => {
  try {
    const result = LoginSchema.safeParse(req.body);

    if (!result.success) {
      res.status(400).json({
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

    const { accessToken, refreashToken } = await this.companyLoginUseCase.execute(dto);

    res.cookie("refreshToken", refreashToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(200).json({ accessToken, message: "Login successful" });

  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: String(error) });
    }
  }
};

  



  getAllCompanies=async(_req:Request,res:Response)=>{
    try{
const companies = await this.getAllCompanyUseCase.execute()
res.status(200).json(companies);
    }catch(error:unknown){
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(400).json({ error: String(error) });
      }
    }
  }


  getCompanyById=async(req:Request,res:Response)=>{
    try{
      const {id} = req.params
     const company =  await this.getCompanyByIdUseCase.execute(id);
     res.status(200).json(company)
    }catch(error){
       if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(400).json({ error: String(error) });
      }
    }
  }

}
