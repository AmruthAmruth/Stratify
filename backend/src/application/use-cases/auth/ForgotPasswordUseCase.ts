import { ICompanyRepository } from "../../../domain/repositories/ICompanyRepository";
import { AppError } from "../../../interfaces/middleware/errorMiddleware";
import { Messages } from "../../../shared/constants/messages";
import { SendOtpUseCase } from "./SendOtpUseCase";



export class ForgotPasswordUseCase{
    constructor(
        private _companyRepository:ICompanyRepository,
        private _sentOTPUseCase: SendOtpUseCase
    ){}
    async execute(email:string):Promise<Date>{
        const existing = await this._companyRepository.findByEmail(email);
        if(!existing) throw  new AppError(Messages.COMPANY_NOT_FOUND, 404);

        const expiresAt = await this._sentOTPUseCase.execute(email)
            return expiresAt
    }
}