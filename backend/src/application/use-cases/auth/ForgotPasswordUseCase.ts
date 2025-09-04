import { ICompanyRepository } from "../../../domain/repositories/ICompanyRepository";
import { IManagerRepo } from "../../../domain/repositories/IManagerRepository";
import { IEmployeeRepository } from "../../../domain/repositories/IEmployeeRepository";
import { AppError } from "../../../interfaces/middleware/ErrorMiddleware";
import { Messages } from "../../../shared/constants/messages";
import { SendOtpUseCase } from "./SendOTPUseCase";

import { Company } from "../../../domain/entities/Company";
import { Manager } from "../../../domain/entities/Manager";
import { Employee } from "../../../domain/entities/Employee";

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
