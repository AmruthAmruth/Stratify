import { Request, Response } from "express";
import { RegisterCompanyUseCase } from "../../application/use-cases/company/RegisterCompanyUseCase";
import { VerifyCompanyOTPUseCase } from "../../application/use-cases/company/VerifyCompanyOTPUseCase";


export class CompanyController{
    constructor(
        private registerUseCase:RegisterCompanyUseCase,
        private verifyUseCase:VerifyCompanyOTPUseCase
    ){}

    register=async(req:Request,res:Response)=>{
        try{
            await this.registerUseCase.execute(req.body);
      res.status(200).json({ message: "OTP sent to email" });

        }catch(error:any){
             res.status(400).json({ error: error.message });
        }
    } 
 
    verifyOTP=async(req:Request,res:Response)=>{
         try {
      const { email, otp, companyData } = req.body;
      await this.verifyUseCase.execute(email, otp, companyData);
      res.status(201).json({ message: "Company registered successfully" });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
     
    }
}