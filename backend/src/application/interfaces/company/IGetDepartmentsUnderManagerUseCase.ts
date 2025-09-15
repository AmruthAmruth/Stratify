import { ManagerDepartmentResponseDTO } from "../../dto/company/ManagerDepartmentResponseDTO";




export interface IGetDepartmentUnderManagerUseCase{
    execute(managerId:string):Promise<ManagerDepartmentResponseDTO[]>
}