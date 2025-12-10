import { Employee } from "../../../domain/entities/Employee";

export interface IUpdateEmployeeProfileUseCase {
    execute(id: string, data: Partial<Employee>): Promise<Employee>;
}
