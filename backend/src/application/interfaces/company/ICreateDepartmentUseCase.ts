import { Department } from "../../../domain/entities/Department";
import { CreateDepartmentDTO } from "../../dto/company/CreateDepartmentDTO";



export interface ICreateDepartmentUseCase{
    execute(data:CreateDepartmentDTO):Promise<Department>;
}