
import { DepartmentDetails } from "../../dto/departments/CompanyDepartmentsDTO";


export interface IGetCompanyDepartmentUseCase{
    execute(companyId:string):Promise<DepartmentDetails[]>
}