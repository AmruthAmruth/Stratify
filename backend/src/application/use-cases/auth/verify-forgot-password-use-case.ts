import { ICompanyRepository } from "../../../domain/repositories/i-company-repository";
import { IOTPRepository } from "../../../domain/repositories/i-otp-repository";
import { Messages } from "../../../shared/constants/messages";

export class VerifyForgotPasswordOTPUseCase {
  constructor(
    private readonly _otpRepository: IOTPRepository,
    private readonly _companyRepository:ICompanyRepository
  ) {}

  async execute(email: string, otp: string): Promise<{success: boolean; companyName: string}> {
    const storedOtp = await this._otpRepository.findByEmail(email);
    if (!storedOtp) throw new Error(Messages.OTP_INVALID);
    if (storedOtp.code !== otp) {
      throw new Error(Messages.OTP_INVALID);
    }

    if (storedOtp.expiresAt < new Date()) {
      throw new Error(Messages.OTP_EXPIRED);
    }
    const companyData = await this._companyRepository.findByEmail(email)
    if(!companyData) throw new Error(Messages.COMPANY_NOT_FOUND)

    return {success: true, companyName: companyData.name }
  }
}
