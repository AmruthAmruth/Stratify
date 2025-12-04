import { IGetDepartmentEmployeesUseCase } from "../../interfaces/managers/IGetDepartmentEmployeesUseCase";
import { IManagerRepository } from "../../../domain/repositories/IManagerRepository";
import { IEmployeeRepository } from "../../../domain/repositories/IEmployeeRepository";
import { Employee } from "../../../domain/entities/Employee";

export class GetDepartmentEmployeesUseCase implements IGetDepartmentEmployeesUseCase {
    constructor(
        private managerRepository: IManagerRepository,
        private employeeRepository: IEmployeeRepository
    ) { }

    async execute(managerId: string): Promise<Employee[]> {
        // Get manager details to find their department
        const manager = await this.managerRepository.findById(managerId);

        if (!manager) {
            throw new Error("Manager not found");
        }

        if (!manager.departmentId) {
            throw new Error("Manager is not assigned to any department");
        }

        // Fetch all employees in the manager's department
        const employees = await this.employeeRepository.findByDepartmentId(manager.departmentId);

        return employees;
    }
}
