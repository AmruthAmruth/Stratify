import { Employee } from "../../../domain/entities/Employee";
import { CreateEmployeeDTO } from "../../dto/employees/CreateEmployeeDTO";

export interface ICreateEmployeeUseCase {
  execute(employeeDto: CreateEmployeeDTO, creatorId: string): Promise<Employee>;
}
