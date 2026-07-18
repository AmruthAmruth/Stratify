import { ICompanyRepository } from "../../../domain/repositories/ICompanyRepository";
import { IEmployeeRepository } from "../../../domain/repositories/IEmployeeRepository";
import { AppError } from "../../../interfaces/middleware/ErrorMiddleware";
import { Messages } from "../../../shared/constants/messages";
import { StatusCodes } from "../../../shared/constants/statusCodes";
import { SendOtpUseCase } from "./SendOTPUseCase";

import { Company } from "../../../domain/entities/Company";
import { Employee } from "../../../domain/entities/Employee";
import { IManagerRepository } from "../../../domain/repositories/IManagerRepository";
import { Manager } from "../../../domain/entities/Manager";
import { IForgotPasswordUseCase } from "../../interfaces/authentication/IForgotPasswordUseCase";

type UserType = Company | Manager | Employee;

export class ForgotPasswordUseCase implements IForgotPasswordUseCase{
  constructor(
    private _companyRepository: ICompanyRepository,
    private _managerRepository: IManagerRepository,
    private _employeeRepository: IEmployeeRepository,
    private _sendOtpUseCase: SendOtpUseCase,
  ) { }

  async execute(email: string): Promise<Date> {
    let user: UserType | null =
      await this._companyRepository.findByEmail(email);

    if (!user) user = await this._managerRepository.findByEmail(email);
    if (!user) user = await this._employeeRepository.findByEmail(email);

    if (!user) throw new AppError(Messages.EMAIL_NOT_FOUND, StatusCodes.NOT_FOUND);

    const expiresAt = await this._sendOtpUseCase.execute(email);
    return expiresAt;
  }
}
