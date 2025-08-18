import { IOTPRepository } from "../../../domain/repositories/IOTPRepository";
import { ICompanyRepository } from "../../../domain/repositories/ICompanyRepository";
import { ITempRegistrationRepository } from "../../../domain/repositories/ITempRegistrationRepository";



export class VerifyCompanyOTPUseCase{
    constructor(
    private otpRepo: IOTPRepository,
    private companyRepo: ICompanyRepository,
     private tempRegRepo: ITempRegistrationRepository
    ){}

    async execute(email:string,otp:string):Promise<void>{
         const storedOtp = await this.otpRepo.findByEmail(email);
    if (!storedOtp || storedOtp.code !== String(otp)) {
      throw new Error("Invalid or expired OTP");
    }

    const companyData = await this.tempRegRepo.findByEmail(email);
    if (!companyData) throw new Error("Registration data expired");

    await this.companyRepo.create(companyData);

     await this.tempRegRepo.delete(email);
    await this.otpRepo.deleteByEmail(email);

    }

    
}



