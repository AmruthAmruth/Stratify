import { ICompanyRepository } from "../../../domain/repositories/ICompanyRepository";
import { Company } from "../../../domain/entities/Company";
import { Messages } from "../../../shared/constants/messages";
import { StatusCodes } from "../../../shared/constants/statusCodes";
import { AppError } from "../../../interfaces/middleware/ErrorMiddleware";

export class GetCompanyByIdUseCase {
  constructor(private _companyRepository: ICompanyRepository) { }

  async execute(id: string): Promise<Company | null> {
    const company = await this._companyRepository.findById(id);
    if (!company) {
      throw new AppError(Messages.COMPANY_NOT_FOUND, StatusCodes.NOT_FOUND);
    }
    return company;
  }
}
