import { Employee } from "../../../domain/entities/Employee";

export interface EmployeeWithDepartment extends Omit<Employee, 'departmentId'> {
    departmentId: {
        _id: string;
        name: string;
    } | null;
}
