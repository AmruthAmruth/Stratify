import { Employee } from "../../../domain/entities/Employee";

export interface IGetDepartmentEmployeesUseCase {
    execute(managerId: string): Promise<Employee[]>;
}
