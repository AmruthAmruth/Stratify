import { ICompanyRepository } from "../../../domain/repositories/ICompanyRepository";
import { IEmployeeRepository } from "../../../domain/repositories/IEmployeeRepository";
import { IOTPRepository } from "../../../domain/repositories/IOTPRepository";
import { Messages } from "../../../shared/constants/messages";

import { Company } from "../../../domain/entities/Company";
import { Employee } from "../../../domain/entities/Employee";
import { IManagerRepository } from "../../../domain/repositories/IManagerRepository";
import { Manager } from "../../../domain/entities/Manager";
import { AppError } from "../../../interfaces/middleware/ErrorMiddleware";

type UserType = Company | Manager | Employee;

export class VerifyForgotPasswordOTPUseCase {
  constructor(
    private readonly _otpRepository: IOTPRepository,
    private readonly _companyRepository: ICompanyRepository,
    private readonly _managerRepository: IManagerRepository,
    private readonly _employeeRepository: IEmployeeRepository,
  ) {}

  async execute(
    email: string,
    otp: string,
  ): Promise<{ success: boolean; userName: string; role: string }> {
    const storedOtp = await this._otpRepository.findByEmail(email);
    if (!storedOtp) throw new AppError(Messages.OTP_INVALID);

    if (storedOtp.code !== otp) throw new AppError(Messages.OTP_INVALID);
    if (storedOtp.expiresAt < new Date())
      throw new AppError(Messages.OTP_EXPIRED);

    let user: UserType | null =
      await this._companyRepository.findByEmail(email);
    if (!user) user = await this._managerRepository.findByEmail(email);
    if (!user) user = await this._employeeRepository.findByEmail(email);

    if (!user) throw new AppError(Messages.EMAIL_NOT_FOUND);

    return { success: true, userName: user.name, role: user.role };
  }
}
