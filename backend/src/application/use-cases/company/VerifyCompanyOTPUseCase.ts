import { IOTPRepository } from "../../../domain/repositories/IOTPRepository";
import { ICompanyRepository } from "../../../domain/repositories/ICompanyRepository";
import { ITempRegistrationRepository } from "../../../domain/repositories/ITempRegistrationRepository";
import { generateAccessToken,generateRefreshToken } from "../../../shared/utils/token";


export class VerifyCompanyOTPUseCase{
    constructor(
    private otpRepo: IOTPRepository,
    private companyRepo: ICompanyRepository,
     private tempRegRepo: ITempRegistrationRepository
    ){}

    async execute(email:string,otp:string):Promise<{accessToken:string,refreshToken:string}>{
         const storedOtp = await this.otpRepo.findByEmail(email);
         console.log("Stored OTP:", storedOtp, "Entered OTP:", otp);

    if (!storedOtp) {
    throw new Error("OTP not found or expired");
    }

if (storedOtp.code !== otp) {
  throw new Error("Invalid OTP");
}

if (storedOtp.expiresAt < new Date()) {
  throw new Error("OTP has expired");
}

    const companyData = await this.tempRegRepo.findByEmail(email);
    if (!companyData) throw new Error("Registration data expired");

    
    const createdCompany = await this.companyRepo.create(companyData);

    const payload = { id: createdCompany._id!, role: createdCompany.role };

    
if (!createdCompany._id) {
  throw new Error("Company ID is missing after creation");
}

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload)

     await this.tempRegRepo.delete(email);
    await this.otpRepo.deleteByEmail(email);

    return {accessToken,refreshToken}
    }

    
}



