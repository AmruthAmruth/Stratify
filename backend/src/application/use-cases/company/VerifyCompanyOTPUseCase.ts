import { IOTPRepository } from "../../../domain/repositories/IOTPRepository";
import { ICompanyRepository } from "../../../domain/repositories/ICompanyRepository";
import { Company } from "../../../domain/entities/Company";

export class VerifyCompanyOTPUseCase{
    constructor(
    private otpRepo: IOTPRepository,
    private companyRepo: ICompanyRepository
    ){}

    async execute(email:string,code:string,companyDate:Company):Promise<void>{
        const otp = await this.otpRepo.findByEmail(email);
        if(!otp) throw new Error("OTP not found");
        if(otp.isExpired()) throw new Error("OTP Expired");
        if(otp.code===code) throw new Error("Invalid OTP")

            await this.companyRepo.create(companyDate);
            await this.otpRepo.deleteByEmail(email)
    }
}