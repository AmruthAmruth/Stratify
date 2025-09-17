import { DepartmentDetailsDTO } from "../../dto/departments/DepartmentDetailsDTO";


export interface IGetCompanyDepartmentDetailsUseCase{
    execute(departmentId:string):Promise<DepartmentDetailsDTO>
}