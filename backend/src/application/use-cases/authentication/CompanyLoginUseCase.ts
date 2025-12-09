import { ICompanyRepository } from "../../../domain/repositories/ICompanyRepository";
import { LoginDTO } from "../../validators/LoginValidator";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../../../shared/utils/token";
import { comparePassword } from "../../../shared/utils/password";
import { Messages } from "../../../shared/constants/messages";
import { StatusCodes } from "../../../shared/constants/statusCodes";
import { IEmployeeRepository } from "../../../domain/repositories/IEmployeeRepository";

import { Company } from "../../../domain/entities/Company";
import { IManagerRepository } from "../../../domain/repositories/IManagerRepository";
import { Manager } from "../../../domain/entities/Manager";
import { Employee } from "../../../domain/entities/Employee";
import { AppError } from "../../../interfaces/middleware/ErrorMiddleware";
import { ISubscriptionRepository } from "../../../domain/repositories/ISubscriptionRepository";
import { INotificationRepository } from "../../../domain/repositories/INotificationRepository";
import { Notification } from "../../../domain/entities/Notification";

type UserType = Company | Manager | Employee;

export class CompanyLoginUseCase {
  constructor(
    private _companyRepository: ICompanyRepository,
    private _managerRepository: IManagerRepository,
    private _employeeRepository: IEmployeeRepository,
    private _subscriptionRepository: ISubscriptionRepository,
    private _notificationRepository: INotificationRepository
  ) { }

  async execute(
    data: LoginDTO,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    let user: UserType | null = await this._companyRepository.findByEmail(
      data.email,
    );

    if (!user) user = await this._managerRepository.findByEmail(data.email);
    if (!user) user = await this._employeeRepository.findByEmail(data.email);
    if (!user) throw new AppError(Messages.EMAIL_NOT_FOUND, StatusCodes.NOT_FOUND);

    const isPassword = await comparePassword(data.password, user.password);
    if (!isPassword) throw new AppError(Messages.LOGIN_FAILED, StatusCodes.UNAUTHORIZED);

    if (user instanceof Company) {
      if (user.status === "pending" || user.status === "rejected") {
        throw new AppError(
          Messages.ACCOUNT_PENDING_APPROVAL,
          StatusCodes.FORBIDDEN,
        );
      }

      const subscription = await this._subscriptionRepository.findByCompanyId(
        user.id!,
      );

      if (!subscription || !["trial", "active"].includes(subscription.status)) {
        throw new AppError(
          Messages.SUBSCRIPTION_INACTIVE,
          StatusCodes.PAYMENT_REQUIRED,
          { companyId: user.id! },
        );
      }
    }


    const notification = new Notification(
      user.id!,
      user.role,
      Messages.LOGIN_SUCCESS,
      `Welcome back ${user.name}! you are successfully logged in`,
      "success"
    )

    await this._notificationRepository.create(notification)

    const payload = { id: user.id!, role: user.role, name: user.name };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    return { accessToken, refreshToken };
  }
}
