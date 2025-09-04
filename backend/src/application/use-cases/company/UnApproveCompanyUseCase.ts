import { ICompanyRepository } from "../../../domain/repositories/ICompanyRepository";
import { IEmailService } from "../../../domain/repositories/IEmailService";
import { Messages } from "../../../shared/constants/messages";


export class UnapproveCompany{
    constructor(
            private _emailService:IEmailService,
            private _companyRepo:ICompanyRepository
    ){}
    async execute(id:string):Promise<void>{

        const company = await this._companyRepo.findById(id);
        if(!company) throw new Error(Messages.COMPANY_NOT_FOUND)

        await this._companyRepo.unapproveCompany(id);

        
        await this._emailService.sendEmail( 
  company.email,
  `Your Company "${company.name}" Registration Was Not Approved`,
  `Dear ${company.name} Team,

We regret to inform you that your company registration has not been approved at this time.  
This decision may be due to incomplete information, eligibility requirements, or other verification criteria.

If you believe this was a mistake or would like to reapply, please review the requirements and submit the necessary details through our platform.

Thank you for your interest in Stratify, and we appreciate your understanding.

Best regards,  
The Stratify Team`
);


    }
}