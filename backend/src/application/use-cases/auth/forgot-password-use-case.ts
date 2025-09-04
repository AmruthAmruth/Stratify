import { ICompanyRepository } from "../../../domain/repositories/i-company-repository";
import { IManagerRepo } from "../../../domain/repositories/i-manager-repository";
import { IEmployeeRepository } from "../../../domain/repositories/i-employee-repository";
import { AppError } from "../../../interfaces/middleware/error-middleware";
import { Messages } from "../../../shared/constants/messages";
import { SendOtpUseCase } from "./send-otp-use-case";

import { Company } from "../../../domain/entities/company";
import { Manager } from "../../../domain/entities/manager";
import { Employee } from "../../../domain/entities/employee";

type UserType = Company | Manager | Employee;

export class ForgotPasswordUseCase {
  constructor(
    private _companyRepository: ICompanyRepository,
    private _managerRepository: IManagerRepo,
    private _employeeRepository: IEmployeeRepository,
    private _sendOtpUseCase: SendOtpUseCase
  ) {}

  async execute(email: string): Promise<Date> {
 
    let user: UserType | null = await this._companyRepository.findByEmail(email);

    if (!user) user = await this._managerRepository.findByEmail(email);
    if (!user) user = await this._employeeRepository.findByEmail(email);

    if (!user) throw new AppError(Messages.EMAIL_NOT_FOUND, 404);

    const expiresAt = await this._sendOtpUseCase.execute(email);
    return expiresAt;
  }
}
