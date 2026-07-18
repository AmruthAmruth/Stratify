import { ICompanyRepository } from "../../../domain/repositories/ICompanyRepository";
import { SendOtpUseCase } from "./SendOTPUseCase";
import { ITempRegistrationRepository } from "../../../domain/repositories/ITempRegistrationRepository";
import { Company } from "../../../domain/entities/Company";
import { hashPassword } from "../../../shared/utils/password";
import { Messages } from "../../../shared/constants/messages";
import { StatusCodes } from "../../../shared/constants/statusCodes";
import { AppError } from "../../../interfaces/middleware/ErrorMiddleware";
import { IRegisterCompanyUseCase } from "../../interfaces/authentication/IRegisterCompanyUseCase";

export class RegisterCompanyUseCase implements IRegisterCompanyUseCase{
  constructor(
    private _companyRepo: ICompanyRepository,
    private _sendOtpUseCase: SendOtpUseCase,
    private _tempRegRepo: ITempRegistrationRepository,
  ) { }

  async execute(data: Company): Promise<Date> {
    const existing = await this._companyRepo.findByEmail(data.email);
    if (existing) throw new AppError(Messages.COMPANY_ALREADY_EXISTS, StatusCodes.CONFLICT);

    const existingInMobile = await this._companyRepo.findByPhone(data.phone);
    if (existingInMobile) throw new AppError(Messages.PHONE_ALREADY_EXISTS, StatusCodes.CONFLICT);

    const hashedPassword = await hashPassword(data.password);

    const expiresAt = new Date(Date.now() + 30 * 60 * 1000);

    const tempData = new Company(
      undefined,
      data.name,
      data.email,
      data.phone,
      data.industry,
      data.description,
      data.businessRegNo,
      data.address,
      data.city,
      data.state,
      data.country,
      data.zipcode,
      hashedPassword,
      data.status ?? "pending",
      "company",
      data.profileImage,
    );

    await this._tempRegRepo.save(data.email, tempData, expiresAt);

    const otpExpiresAt = await this._sendOtpUseCase.execute(data.email);

    return otpExpiresAt;
  }
}
