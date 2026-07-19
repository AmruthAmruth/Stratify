import { IOTPRepository } from "../../../domain/repositories/IOTPRepository";
import { ICompanyRepository } from "../../../domain/repositories/ICompanyRepository";
import { ITempRegistrationRepository } from "../../../domain/repositories/ITempRegistrationRepository";
import { Messages } from "../../../shared/constants/messages";
import { StatusCodes } from "../../../shared/constants/statusCodes";
import { Company } from "../../../domain/entities/Company";
import { ICreateTrialSubscriptionUseCase } from "../../interfaces/subscriptions/ICreateTrialSubscriptionUseCase";
import { IVerifyCompanyOTPUseCase } from "../../interfaces/authentication/IVerifyCompanyOTPUseCase";
import { AppError } from "../../../interfaces/middleware/ErrorMiddleware";

export class VerifyCompanyOTPUseCase implements IVerifyCompanyOTPUseCase{
  constructor(
    private _otpRepo: IOTPRepository,
    private _companyRepo: ICompanyRepository,
    private _tempRegRepo: ITempRegistrationRepository,
    private _createTrialSubscriptionUseCase: ICreateTrialSubscriptionUseCase,
  ) { }

  async execute(
    email: string,
    otp: string,
  ): Promise<void> {
    const storedOtp = await this._otpRepo.findByEmail(email);
    console.log("Stored OTP:", storedOtp, "Entered OTP:", otp);

    if (!storedOtp) throw new AppError(Messages.OTP_EXPIRED, StatusCodes.BAD_REQUEST);
    if (storedOtp.code !== otp) throw new AppError(Messages.OTP_INVALID, StatusCodes.BAD_REQUEST);
    if (storedOtp.expiresAt < new Date()) throw new AppError(Messages.OTP_EXPIRED, StatusCodes.BAD_REQUEST);

    const companyData = await this._tempRegRepo.findByEmail(email);
    if (!companyData) throw new AppError(Messages.REGISTRATION_DATA_EXPIRED, StatusCodes.BAD_REQUEST);

    console.log("Company Data :", companyData);

    if (!companyData.password)
      throw new AppError(Messages.PASSWORD_MISSING, StatusCodes.BAD_REQUEST);

    const sanitizedProfileImage = typeof companyData.profileImage === 'string' ? companyData.profileImage : undefined;

    const createdCompany = await this._companyRepo.create(
      new Company(
        undefined,
        companyData.name,
        companyData.email,
        companyData.phone,
        companyData.industry,
        companyData.description,
        companyData.businessRegNo,
        companyData.address,
        companyData.city,
        companyData.state,
        companyData.country,
        companyData.zipcode,
        companyData.password,
        companyData.status,
        "company",
        sanitizedProfileImage,
      ),
    );

    if (!createdCompany.id)
      throw new AppError(Messages.COMPANY_ID_MISSING_AFTER_CREATION, StatusCodes.BAD_REQUEST);

    await this._createTrialSubscriptionUseCase.execute(createdCompany.id);

    // Cleanup temporary data
    await this._tempRegRepo.delete(email);
    await this._otpRepo.deleteByEmail(email);

    // No token generation - company must be approved by super admin before login
    return;
  }
}
