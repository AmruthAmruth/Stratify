
import { ICompanyRepository } from "../../../domain/repositories/i-company-repository";
import { LoginDTO } from "../../validators/login-validator";
import { generateAccessToken,generateRefreshToken } from "../../../shared/utils/token";
import { comparePassword } from "../../../shared/utils/password";
import { Messages } from "../../../shared/constants/messages";
import { IManagerRepo } from "../../../domain/repositories/i-manager-repository";
import { IEmployeeRepository } from "../../../domain/repositories/i-employee-repository";

import { Company } from "../../../domain/entities/company";
import { Manager } from "../../../domain/entities/manager";
import { Employee } from "../../../domain/entities/employee";

type UserType = Company | Manager | Employee; 

export class CompanyLoginUseCase{
    constructor(
        private _companyRepository : ICompanyRepository,
        private _managerRepository : IManagerRepo,
        private _employeeRepository:IEmployeeRepository
 
    ){};

     
  
    async execute(data:LoginDTO):Promise<{accessToken:string,refreshToken:string}>{
      let user: UserType | null = await this._companyRepository.findByEmail(data.email);

    if (!user) user = await this._managerRepository.findByEmail(data.email); 
    if (!user) user = await this._employeeRepository.findByEmail(data.email);
    if (!user) throw new Error(Messages.EMAIL_NOT_FOUND);
console.log("USER :",user);

    const isPassword = await comparePassword(data.password, user.password);
    if (!isPassword) throw new Error(Messages.LOGIN_FAILED);

    const payload =  { id: user.id!, role: user.role };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    return { accessToken, refreshToken };
    }
}
 