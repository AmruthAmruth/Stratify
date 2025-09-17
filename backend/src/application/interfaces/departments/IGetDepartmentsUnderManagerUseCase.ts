import { ManagerDepartmentResponseDTO } from "../../dto/departments/ManagerDepartmentResponseDTO";




export interface IGetDepartmentUnderManagerUseCase{
    execute(managerId:string):Promise<ManagerDepartmentResponseDTO[]>
}