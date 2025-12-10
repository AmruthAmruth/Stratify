import { ICompanyRepository } from "../../../domain/repositories/ICompanyRepository";
import { Company } from "../../../domain/entities/Company";
import { IUpdateCompanyProfileUseCase } from "../../interfaces/company/IUpdateCompanyProfileUseCase";
import { AppError } from "../../../interfaces/middleware/ErrorMiddleware";
import { StatusCodes } from "../../../shared/constants/statusCodes";
import { Messages } from "../../../shared/constants/messages";

export class UpdateCompanyProfileUseCase implements IUpdateCompanyProfileUseCase {
    constructor(private _companyRepository: ICompanyRepository) { }

    async execute(id: string, data: Partial<Company>): Promise<Company> {
        const company = await this._companyRepository.findById(id);

        if (!company) {
            throw new AppError(Messages.COMPANY_NOT_FOUND, StatusCodes.NOT_FOUND);
        }

        // Update fields
        if (data.name) company.name = data.name;
        if (data.phone) company.phone = data.phone;
        if (data.industry) company.industry = data.industry;
        if (data.description) company.description = data.description;
        if (data.businessRegNo) company.businessRegNo = data.businessRegNo;
        if (data.address) company.address = data.address;
        if (data.city) company.city = data.city;
        if (data.state) company.state = data.state;
        if (data.country) company.country = data.country;
        if (data.zipcode) company.zipcode = data.zipcode;
        if (data.profileImage) company.profileImage = data.profileImage;

        return await this._companyRepository.update(company);
    }
}
