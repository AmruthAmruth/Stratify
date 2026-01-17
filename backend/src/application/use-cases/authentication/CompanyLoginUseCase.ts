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
import { ICompanyThemeRepository } from "../../../domain/repositories/ICompanyThemeRepository";
import { CompanyTheme } from "../../../domain/entities/CompanyTheme";

type UserType = Company | Manager | Employee;

export class CompanyLoginUseCase {
  constructor(
    private _companyRepository: ICompanyRepository,
    private _managerRepository: IManagerRepository,
    private _employeeRepository: IEmployeeRepository,
    private _subscriptionRepository: ISubscriptionRepository,
    private _notificationRepository: INotificationRepository,
    private _companyThemeRepository: ICompanyThemeRepository
  ) { }

  async execute(
    data: LoginDTO,
  ): Promise<{ accessToken: string; refreshToken: string; companyId: string; theme: CompanyTheme | null }> {
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

    // Determine companyId based on user type
    let companyId: string;
    if (user instanceof Company) {
      companyId = user.id!;
    } else {
      // Manager or Employee
      companyId = user.companyId;
    }

    // Fetch company theme
    let theme: CompanyTheme | null = null;
    try {
      theme = await this._companyThemeRepository.findByCompanyId(companyId);

      // If no theme exists, create default theme
      if (!theme) {
        const defaultTheme = new CompanyTheme(
          undefined,
          companyId,
          'Clean Professional',
          'light',
          '#16a34a', // Primary - Green
          '#1f2937', // Secondary - Dark gray
          '#e5e7eb', // Accent - Light gray
          '#f7faf9', // Background - Off-white
          '#1f2937', // Text - Dark gray
          '#ffffff', // Surface - White
          '#e5e7eb', // Border - Light gray
          '#6b7280', // Muted - Medium gray
          '#0f172a', // Heading - Very dark
          false // Not custom
        );
        theme = await this._companyThemeRepository.create(defaultTheme);
      }
    } catch (error) {
      console.error('Error fetching company theme:', error);
      // Continue without theme - frontend will use default
    }

    const payload = { id: user.id!, role: user.role, name: user.name };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    return { accessToken, refreshToken, companyId, theme };
  }
}
