
import { RegisterCompanySchema } from "../../dto/company/RegisterCompanySchema";
import { ICompanyRepository } from "../../../domain/repositories/ICompanyRepository";
import { SendOtpUseCase } from "../auth/SendOtpUseCase";
import { ITempRegistrationRepository } from "../../../domain/repositories/ITempRegistrationRepository";
import { Company } from "../../../domain/entities/Company";
import { hashPassword } from "../../../shared/utils/passwordHash";
import { Messages } from "../../../shared/constants/messages";

export class RegisterCompanyUseCase {
  constructor(
    private _companyRepo: ICompanyRepository,
    private _sendOtpUseCase: SendOtpUseCase,
    private _tempRegRepo: ITempRegistrationRepository,
  ) {}

  async execute(data: Company): Promise<void> {
    RegisterCompanySchema.parse(data);
    const existing = await this._companyRepo.findByEmail(data.email);
    if (existing) throw new Error(Messages.COMPANY_ALREADY_EXISTS);

const existingInMobile = await this._companyRepo.findByPhone(data.phone);
if (existingInMobile) throw new Error(Messages.PHONE_ALREADY_EXISTS);
 


const hasedPassword = await hashPassword(data.password)


     const expiresAt = new Date(Date.now() + 3 * 60 * 1000); 
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
    await this._sendOtpUseCase.execute(data.email); 

  }
}
