import { IGetDepartmentEmployeesUseCase } from "../../interfaces/managers/IGetDepartmentEmployeesUseCase";
import { IManagerRepository } from "../../../domain/repositories/IManagerRepository";
import { IEmployeeRepository } from "../../../domain/repositories/IEmployeeRepository";
import { Employee } from "../../../domain/entities/Employee";
import { AppError } from "../../../interfaces/middleware/ErrorMiddleware";
import { StatusCodes } from "../../../shared/constants/statusCodes";
import { Messages } from "../../../shared/constants/messages";

export class GetDepartmentEmployeesUseCase implements IGetDepartmentEmployeesUseCase {
    constructor(
        private managerRepository: IManagerRepository,
        private employeeRepository: IEmployeeRepository
    ) { }

    async execute(managerId: string): Promise<Employee[]> {

        const manager = await this.managerRepository.findById(managerId);

        if (!manager) {
            throw new AppError(Messages.MANAGER_NOT_FOUND, StatusCodes.NOT_FOUND);
        }

        if (!manager.departmentId) {
            throw new AppError(Messages.MANAGER_NO_DEPARTMENT, StatusCodes.BAD_REQUEST);
        }

        const employees = await this.employeeRepository.findByDepartmentId(manager.departmentId);

        return employees;
    }
}
