import { OTPRepository } from "../../../domain/repositories/IOTPRepository";
import { generateOtp } from "../../../shared/utils/otpUtils";
import { OTP } from "../../../domain/entities/OTP";
import { EmailService } from "../../../infrastructure/services/EmailService";
export class SendOtpUseCase{
    constructor(
    private otpRepo: OTPRepository,
    private emailService: EmailService 
    ){}

    async execute(userId: string, email: string): Promise<void> {
    const otpCode = generateOtp();
    const expiresAt = new Date(Date.now() + 3 * 60 * 1000); 

    await this.otpRepo.save(new OTP(userId, otpCode, expiresAt));
    await this.emailService.send(email, "Your OTP Code", `Your OTP is ${otpCode}`);
  }
}

