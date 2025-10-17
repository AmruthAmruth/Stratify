import { Department } from "../../../domain/entities/Department";
import { CreateDepartmentDTO } from "../../dto/departments/CreateDepartmentDTO";

export interface ICreateDepartmentUseCase {
  execute(data: CreateDepartmentDTO): Promise<Department>;
}
