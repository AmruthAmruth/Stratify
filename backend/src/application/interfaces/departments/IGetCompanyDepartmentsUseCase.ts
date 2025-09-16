
import { DepartmentDetails } from "../../dto/company/CompanyDepartmentsDTO";


export interface IGetCompanyDepartmentUseCase{
    execute(companyId:string):Promise<DepartmentDetails[]>
}