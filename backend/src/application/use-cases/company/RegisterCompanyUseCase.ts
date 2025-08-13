import { RegisterCompanyDTO,RegisterCompanySchema } from "../../dto/company/RegisterCompanyDTO";
import { ICompanyRepository } from "../../../domain/repositories/ICompanyRepository";
import { Company } from "../../../domain/entities/Company";
import { EmailService } from "../../../infrastructure/services/EmailService";
import { OTP } from "../../../domain/entities/OTP";
import { IOTPRepository } from "../../../domain/repositories/IOTPRepository";
import { generateOtp } from "../../../shared/utils/otpUtils";
export class RegisterCompanyUseCase{
    constructor(
    private companyRepo: ICompanyRepository,
    private otpRepo: IOTPRepository,
    private emailService: EmailService
    ){}

    async execute(data:RegisterCompanyDTO):Promise<void>{
        RegisterCompanySchema.parse(data)
        const existing = await this.companyRepo.findByEmail(data.email);
        if(existing) throw new Error("Company already registered");
        const otpCode=generateOtp();
          const otp = new OTP(data.email, otpCode, new Date(Date.now() + 3 * 60000)); 
          await this.otpRepo.save(otp);

             await this.emailService.sendEmail(
      data.email,
      "Your OTP Code",
      `<p>Your OTP is <b>${otpCode}</b>. It will expire in 3 minutes.</p>`
    );
    }


} 