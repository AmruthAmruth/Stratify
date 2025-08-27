import { OTP } from "../../../domain/entities/otp";
import { IOTPRepository } from "../../../domain/repositories/i-otp-repository";
import { ITempRegistrationRepository } from "../../../domain/repositories/i-temp-registration-repository";
import { EmailService } from "../../../infrastructure/services/email-service";
import { generateOtp } from "../../../shared/utils/otpUtils";

export class ResendOtpUseCase{
    constructor(
            private _otpRepo:IOTPRepository,
            private _emailService:EmailService,
            private _tempRegRepo : ITempRegistrationRepository,

    ){}

    async execute(email:string):Promise<void>{
        const tempData = await this._tempRegRepo.findByEmail(email);
    if (!tempData) {
      throw new Error("Registration data expired. Please register again.");
    }

        const otpCode = generateOtp();
    const expiresAt = new Date(Date.now() + 3 * 60 * 1000);
       
 console.log("Resent OTP Code:", otpCode);

  await this._otpRepo.save(new OTP(email, otpCode, expiresAt));
   await this._emailService.sendEmail(
      email,
      "Your New OTP Code",
      `Your new OTP is ${otpCode}`
    );
    }
}