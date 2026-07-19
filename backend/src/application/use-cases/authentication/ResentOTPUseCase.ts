import { OTP } from "../../../domain/entities/OTP";
import { IOTPRepository } from "../../../domain/repositories/IOTPRepository";
import { ITempRegistrationRepository } from "../../../domain/repositories/ITempRegistrationRepository";
import { EmailService } from "../../../infrastructure/services/EmailService";
import { AppError } from "../../../interfaces/middleware/ErrorMiddleware";
import { Messages } from "../../../shared/constants/messages";
import { StatusCodes } from "../../../shared/constants/statusCodes";
import { generateOtp } from "../../../shared/utils/otpUtils";
import { IResendOtpUseCase } from "../../interfaces/authentication/IResentOTPUseCase";

export class ResendOtpUseCase implements IResendOtpUseCase{
  constructor(
    private _otpRepo: IOTPRepository,
    private _emailService: EmailService,
    private _tempRegRepo: ITempRegistrationRepository,
  ) {}

  async execute(email: string): Promise<void> {
    const tempData = await this._tempRegRepo.findByEmail(email);
    if (!tempData) {
      throw new AppError(Messages.REGISTRATION_DATA_EXPIRED_RETRY, StatusCodes.BAD_REQUEST);
    }

    const otpCode = generateOtp();
    const expiresAt = new Date(Date.now() + 3 * 60 * 1000);

    console.log("Resent OTP Code:", otpCode);

    await this._otpRepo.save(new OTP(email, otpCode, expiresAt));
    await this._emailService.sendEmail(
      email,
      "Your New OTP Code",
      `Your new OTP is ${otpCode}`,
    );
  }
}
