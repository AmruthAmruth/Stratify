
import { ICompanyRepository } from "../../../domain/repositories/ICompanyRepository";
import { LoginDTO } from "../../dto/auth/LoginSchema";
import { generateAccessToken,generateRefreshToken } from "../../../shared/utils/token";
import { comparePassword } from "../../../shared/utils/password";
import { Messages } from "../../../shared/constants/messages";


export class CompanyLoginUseCase{
    constructor(private _companyRepository : ICompanyRepository){};

    async execute(data:LoginDTO):Promise<{accessToken:string,refreshToken:string}>{
       
        
        const user = await this._companyRepository.findByEmail(data.email);
        if(!user) throw new Error(Messages.EMAIL_NOT_FOUND)

            const isPassword = await comparePassword(data.password,user.password);
        if(!isPassword) throw new Error(Messages.LOGIN_FAILED)

            const payload = {id:user.id,role:user.role};
            const accessToken = generateAccessToken(payload);
            const refreshToken = generateRefreshToken(payload)
            return {accessToken,refreshToken}
    }
}
