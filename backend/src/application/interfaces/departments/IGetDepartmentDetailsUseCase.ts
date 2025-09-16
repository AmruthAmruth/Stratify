import { DepartmentDetailsDTO } from "../../dto/company/DepartmentDetailsDTO";


export interface IGetCompanyDepartmentDetailsUseCase{
    execute(departmentId:string):Promise<DepartmentDetailsDTO>
}