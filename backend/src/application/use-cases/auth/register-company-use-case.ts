
import { RegisterCompanySchema } from "../../validators/company-validator";
import { ICompanyRepository } from "../../../domain/repositories/i-company-repository";
import { SendOtpUseCase } from "./send-otp-use-case";
import { ITempRegistrationRepository } from "../../../domain/repositories/i-temp-registration-repository";
import { Company } from "../../../domain/entities/company";
import { hashPassword } from "../../../shared/utils/password";
import { Messages } from "../../../shared/constants/messages";

export class RegisterCompanyUseCase {
  constructor(
    private _companyRepo: ICompanyRepository,
    private _sendOtpUseCase: SendOtpUseCase,
    private _tempRegRepo: ITempRegistrationRepository,
  ) {}

  async execute(data: Company): Promise<Date> {
    RegisterCompanySchema.parse(data);
    const existing = await this._companyRepo.findByEmail(data.email);
    if (existing) throw new Error(Messages.COMPANY_ALREADY_EXISTS);

const existingInMobile = await this._companyRepo.findByPhone(data.phone);
if (existingInMobile) throw new Error(Messages.PHONE_ALREADY_EXISTS);
 


const hasedPassword = await hashPassword(data.password)


     const expiresAt = new Date(Date.now() + 30 * 60 * 1000); 
      const tempData = new Company(
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
    hasedPassword,
    data.status,
    data.profileImage,
    data._id,
    "company" 
  );

    await this._tempRegRepo.save(data.email, tempData, expiresAt);
 const otpExpiresAt=   await this._sendOtpUseCase.execute(data.email); 
  return otpExpiresAt
  }
}
