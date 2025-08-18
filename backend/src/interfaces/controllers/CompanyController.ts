import { Request, Response } from "express";
import { RegisterCompanyUseCase } from "../../application/use-cases/company/RegisterCompanyUseCase";
import { VerifyCompanyOTPUseCase } from "../../application/use-cases/company/VerifyCompanyOTPUseCase";

export class CompanyController {
  constructor(
    private registerUseCase: RegisterCompanyUseCase,
    private verifyUseCase: VerifyCompanyOTPUseCase
  ) {}

  register = async (req: Request, res: Response) => {
    try {
       if (req.file) {
      req.body.profileImage = (req.file as any).path;
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
      await this.verifyUseCase.execute(email, otp);
      res.status(201).json({ message: "Company registered successfully" });
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(400).json({ error: String(error) });
      }
    }
  };


   
 







}
