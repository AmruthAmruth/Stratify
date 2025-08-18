
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
     const expiresAt = new Date(Date.now() + 3 * 60 * 1000); 
    await this.tempRegRepo.save(data.email, data, expiresAt);
    await this.sendOtpUseCase.execute(data.email); 

  }
}
