import { GetProjectsByDepartmentDTO } from "../../dto/project/GetProjectsByDepartmentDTO";



export interface IGetProjectsByDepartmentUseCase{
    execute(departmentId:string):Promise<GetProjectsByDepartmentDTO[]>
}