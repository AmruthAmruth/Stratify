import { Employee } from "../../../domain/entities/Employee";
import { ICompanyRepository } from "../../../domain/repositories/ICompanyRepository";
import { IEmployeeRepository } from "../../../domain/repositories/IEmployeeRepository";
import { Messages } from "../../../shared/constants/messages";



export class GetEmployeeByCompanyId{
    constructor(
        private _companyRepo :ICompanyRepository,
        private _employeeRepo:IEmployeeRepository
    ){}

    async execute(companyId:string):Promise<Employee[]>{
          const company = await this._companyRepo.findById(companyId);
          
          
    if (!company) {
      throw new Error(Messages.COMPANY_NOT_FOUND);
    }


  const employees = await this._employeeRepo.findByCompanyId(companyId);
  console.log("Employee ",employees);
  
return employees
    }
}