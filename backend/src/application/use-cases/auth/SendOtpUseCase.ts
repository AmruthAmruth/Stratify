import { IOTPRepository } from "../../../domain/repositories/IOTPRepository";
import { generateOtp } from "../../../shared/utils/otpUtils";
import { OTP } from "../../../domain/entities/OTP";
import { EmailService } from "../../../infrastructure/services/EmailService";
export class SendOtpUseCase{
    constructor(
    private otpRepo: IOTPRepository,
    private emailService: EmailService 
    ){}

   async execute(email: string, userId?: string): Promise<void> {
  const otpCode = generateOtp();
  const expiresAt = new Date(Date.now() + 3 * 60 * 1000);
  const identifier: string = userId ?? email;

  await this.otpRepo.save(new OTP(identifier, otpCode, expiresAt));
  await this.emailService.sendEmail(
    email,
    "Your OTP Code",
    `Your OTP is ${otpCode}`
  );
}
}

  