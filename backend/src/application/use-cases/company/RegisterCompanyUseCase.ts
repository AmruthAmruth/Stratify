
import { RegisterCompanySchema } from "../../dto/company/RegisterCompanySchema";
import { ICompanyRepository } from "../../../domain/repositories/ICompanyRepository";
import { SendOtpUseCase } from "../auth/SendOtpUseCase";
import { ITempRegistrationRepository } from "../../../domain/repositories/ITempRegistrationRepository";
import { Company } from "../../../domain/entities/Company";

export class RegisterCompanyUseCase {
  constructor(
    private companyRepo: ICompanyRepository,
    private sendOtpUseCase: SendOtpUseCase,
    private tempRegRepo: ITempRegistrationRepository,
  ) {}

  async execute(data: Company): Promise<void> {
    RegisterCompanySchema.parse(data);
    const existing = await this.companyRepo.findByEmail(data.email);
    if (existing) throw new Error("Company already registered");

const existingInMobile = await this.companyRepo.findByPhone(data.phone);
if (existingInMobile) throw new Error("Phone number already registered");

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
    data.password,
    data.status,
    data.profileImage,
    data._id,
    "company" 
  );

    await this.tempRegRepo.save(data.email, tempData, expiresAt);
    await this.sendOtpUseCase.execute(data.email); 

  }
}
