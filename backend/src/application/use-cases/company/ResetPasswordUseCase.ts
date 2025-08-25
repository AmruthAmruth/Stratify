import { ICompanyRepository } from "../../../domain/repositories/ICompanyRepository";
import { Messages } from "../../../shared/constants/messages";
import { hashPassword } from "../../../shared/utils/password";




export class ResetPasswordUseCase{
    constructor(
        private readonly _companyRepository : ICompanyRepository
    ){}

    async execute(email:string,password:string):Promise<boolean>{
            const company = await this._companyRepository.findByEmail(email);
            if(!company) throw new Error(Messages.COMPANY_NOT_FOUND)

                const hashedPassword = await hashPassword(password);

                await this._companyRepository.updatePassword(email,hashedPassword);
              return true  
    }
}