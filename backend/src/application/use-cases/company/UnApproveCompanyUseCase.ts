import { ICompanyRepository } from "../../../domain/repositories/ICompanyRepository";
import { IEmailService } from "../../../domain/repositories/IEmailService";
import { AppError } from "../../../interfaces/middleware/ErrorMiddleware";
import { Messages } from "../../../shared/constants/messages";
import { unapproveCompanyTemplate } from "../../templates/UnapproveCompanyTemplate";


export class UnapproveCompany{
    constructor(
            private _emailService:IEmailService,
            private _companyRepo:ICompanyRepository
    ){}
    async execute(id:string):Promise<void>{

        const company = await this._companyRepo.findById(id);
        if(!company) throw new AppError(Messages.COMPANY_NOT_FOUND)

        await this._companyRepo.unapproveCompany(id);

    const html = unapproveCompanyTemplate(company.name);
        
        await this._emailService.sendEmail( 
  company.email,
  `Your Company "${company.name}" Registration Was Not Approved`,
  html
);


    }
}