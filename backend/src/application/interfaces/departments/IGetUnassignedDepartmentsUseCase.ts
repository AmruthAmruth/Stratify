import { UnassignedDepartmentDTO } from "../../dto/company/UnassignedDepartmentDTO";




export interface IGetUnassignedDepartments{
    execute(companyId:string):Promise<UnassignedDepartmentDTO[]>
}