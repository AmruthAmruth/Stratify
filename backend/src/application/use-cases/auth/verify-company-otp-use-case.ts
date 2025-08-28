import { IOTPRepository } from "../../../domain/repositories/i-otp-repository";
import { ICompanyRepository } from "../../../domain/repositories/i-company-repository";
import { ITempRegistrationRepository } from "../../../domain/repositories/i-temp-registration-repository";
import { generateAccessToken,generateRefreshToken } from "../../../shared/utils/token";
import { Messages } from "../../../shared/constants/messages";


export class VerifyCompanyOTPUseCase{
    constructor(
    private _otpRepo: IOTPRepository,
    private _companyRepo: ICompanyRepository,
    private _tempRegRepo: ITempRegistrationRepository
    ){}

    async execute(email:string,otp:string):Promise<{accessToken:string,refreshToken:string}>{
         const storedOtp = await this._otpRepo.findByEmail(email);
         console.log("Stored OTP:", storedOtp, "Entered OTP:", otp);

    if (!storedOtp) {
    throw new Error(Messages.OTP_EXPIRED);
    }

if (storedOtp.code !== otp) {
  throw new Error(Messages.OTP_INVALID);
}

if (storedOtp.expiresAt < new Date()) {
  throw new Error(Messages.OTP_EXPIRED);
}

    const companyData = await this._tempRegRepo.findByEmail(email);
    if (!companyData) throw new Error("Registration data expired");

    
    const createdCompany = await this._companyRepo.create(companyData);

    const payload = { id: createdCompany.id!, role: createdCompany.role };

    
if (!createdCompany.id) {
  throw new Error("Company ID is missing after creation");
}

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload)

     await this._tempRegRepo.delete(email);
    await this._otpRepo.deleteByEmail(email);

    return {accessToken,refreshToken}
    }

    
}



