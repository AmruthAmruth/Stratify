import { ManagerDepartmentResponseDTO } from "../../dto/departments/ManagerDepartmentResponseDTO";




export interface IGetManagerDepartmentsUseCase{
    execute(managerId:string):Promise<ManagerDepartmentResponseDTO[]>
}