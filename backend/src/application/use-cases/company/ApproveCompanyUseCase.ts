import { ICompanyRepository } from "../../../domain/repositories/ICompanyRepository";
import { IEmailService } from "../../../domain/repositories/IEmailService";
import { AppError } from "../../../interfaces/middleware/ErrorMiddleware";
import { Messages } from "../../../shared/constants/messages";
import { approveCompanyTemplate } from "../../../shared/templates/ApproveCompanyTemplate";

export class ApproveCompany {
  constructor(
    private _emailService: IEmailService,
    private _companyRepo: ICompanyRepository,
  ) {}

  async execute(id: string): Promise<void> {
    const company = await this._companyRepo.findById(id);
    if (!company) throw new AppError(Messages.COMPANY_NOT_FOUND);
    if (company.status == "approved")
      throw new AppError("Company Already Approved");

    await this._companyRepo.approveCompany(id);
    const html = approveCompanyTemplate(company.name);

    await this._emailService.sendEmail(
      company.email,
      `Your Company "${company.name}" Has Been Approved`,
      html,
    );
  }
}
