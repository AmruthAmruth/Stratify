import { ICompanyRepository } from "../../../domain/repositories/ICompanyRepository";
import { IEmailService } from "../../../domain/repositories/IEmailService";
import { Messages } from "../../../shared/constants/messages";




export class ApproveCompany{
    constructor(
        private _emailService:IEmailService,
        private _companyRepo:ICompanyRepository,
    ){}

    async execute(id:string):Promise<void>{

        const company = await this._companyRepo.findById(id);
        if(!company) throw new Error(Messages.COMPANY_NOT_FOUND)
            if(company.status=="approved") throw new Error("Company Already Approved")

       await this._companyRepo.approveCompany(id)

      await this._emailService.sendEmail( 
  company.email,
  `Your Company "${company.name}" Has Been Approved`,
  `Dear ${company.name} Team,

We are pleased to inform you that your company registration has been successfully approved.  
You can now access your account and start managing your company with ease through our platform.

Welcome aboard, and we look forward to supporting your growth.

Best regards,  
The Stratify Team`
);

    }
}