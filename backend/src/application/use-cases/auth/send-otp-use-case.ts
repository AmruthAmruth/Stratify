import { IOTPRepository } from "../../../domain/repositories/i-otp-repository";
import { generateOtp } from "../../../shared/utils/otpUtils";
import { OTP } from "../../../domain/entities/otp";
import { IEmailService } from "../../../domain/repositories/i-email-services";


export class SendOtpUseCase{
    constructor(
    private _otpRepo: IOTPRepository,
    private _emailService: IEmailService 
    ){}

   async execute(email: string, userId?: string): Promise<Date> {
  const otpCode = generateOtp();
     const expiresAt = new Date(Date.now() + 3 * 60 * 1000); 
  const identifier: string = userId ?? email;
   console.log("OTP Code ",otpCode);
   
  await this._otpRepo.save(new OTP(identifier, otpCode, expiresAt));
  await this._emailService.sendEmail(
    email,
    "Your OTP Code",
    `Your OTP is ${otpCode}`
  );
  return expiresAt
}

}

  