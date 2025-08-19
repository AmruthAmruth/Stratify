
import { ICompanyRepository } from "../../../domain/repositories/ICompanyRepository";
import { LoginDTO } from "../../dto/auth/LoginSchema";
import { generateAccessToken,generateRefreshToken } from "../../../shared/utils/token";
import { comparePassword } from "../../../shared/utils/passwordHash";


export class CompanyLoginUseCase{
    constructor(private companyRepository : ICompanyRepository){};

    async execute(data:LoginDTO):Promise<{accessToken:string,refreashToken:string}>{
        console.log("Hello Login");
        
        const user = await this.companyRepository.findByEmail(data.email);
        if(!user) throw new Error("Email not found")

            const isPassword = await comparePassword(data.password,user.password);
        if(!isPassword) throw new Error("Invalid Credentials")

            const payload = {id:user.id,role:user.role};
            const accessToken = generateAccessToken(payload);
            const refreashToken = generateRefreshToken(payload)
            return {accessToken,refreashToken}
    }
}