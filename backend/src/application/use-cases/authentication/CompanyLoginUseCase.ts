import { ICompanyRepository } from "../../../domain/repositories/ICompanyRepository";
import { LoginDTO } from "../../validators/LoginValidator";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../../../shared/utils/token";
import { comparePassword } from "../../../shared/utils/password";
import { Messages } from "../../../shared/constants/messages";
import { IEmployeeRepository } from "../../../domain/repositories/IEmployeeRepository";

import { Company } from "../../../domain/entities/Company";
import { IManagerRepository } from "../../../domain/repositories/IManagerRepository";
import { Manager } from "../../../domain/entities/Manager";
import { Employee } from "../../../domain/entities/Employee";
import { AppError } from "../../../interfaces/middleware/ErrorMiddleware";
import { ISubscriptionRepository } from "../../../domain/repositories/ISubscriptionRepository";

type UserType = Company | Manager | Employee;

export class CompanyLoginUseCase {
  constructor(
    private _companyRepository: ICompanyRepository,
    private _managerRepository: IManagerRepository,
    private _employeeRepository: IEmployeeRepository,
    private _subscriptionRepository: ISubscriptionRepository,
  ) {}

  async execute(
    data: LoginDTO,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    let user: UserType | null = await this._companyRepository.findByEmail(
      data.email,
    );

    if (!user) user = await this._managerRepository.findByEmail(data.email);
    if (!user) user = await this._employeeRepository.findByEmail(data.email);
    if (!user) throw new AppError(Messages.EMAIL_NOT_FOUND, 404);

    const isPassword = await comparePassword(data.password, user.password);
    if (!isPassword) throw new AppError(Messages.LOGIN_FAILED, 401);

    if (user instanceof Company) {
      if (user.status === "pending" || user.status === "rejected") {
        throw new AppError(
          "Your account is still pending approval by Stratify Team.",
          403,
        );
      }

      const subscription = await this._subscriptionRepository.findByCompanyId(
        user.id!,
      );

      if (!subscription || !["trial", "active"].includes(subscription.status)) {
        throw new AppError(
          "Your subscription is not active. Please subscribe to continue.",
          402,
          { companyId: user.id! },
        );
      }
    }

    const payload = { id: user.id!, role: user.role, name: user.name };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    return { accessToken, refreshToken };
  }
}
