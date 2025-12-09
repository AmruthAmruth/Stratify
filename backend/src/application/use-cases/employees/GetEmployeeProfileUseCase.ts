import { IGetEmployeeProfileUseCase, EmployeeProfileResponse } from "../../interfaces/employees/IGetEmployeeProfileUseCase";
import { IEmployeeRepository } from "../../../domain/repositories/IEmployeeRepository";
import { AppError } from "../../../interfaces/middleware/ErrorMiddleware";
import { StatusCodes } from "../../../shared/constants/statusCodes";
import { Messages } from "../../../shared/constants/messages";

export class GetEmployeeProfileUseCase implements IGetEmployeeProfileUseCase {
    constructor(
        private employeeRepository: IEmployeeRepository
    ) { }

    async execute(employeeId: string): Promise<EmployeeProfileResponse> {
        const employee = await this.employeeRepository.findByIdWithDepartment(employeeId);

        if (!employee) {
            throw new AppError(Messages.EMPLOYEE_NOT_FOUND, StatusCodes.NOT_FOUND);
        }

        return {
            id: employee.id!,
            name: employee.name,
            email: employee.email,
            phone: employee.phone,
            dateOfBirth: employee.dob,
            profileImage: employee.profileImage,
            department: employee.departmentId ? {
                id: employee.departmentId._id.toString(),
                name: employee.departmentId.name
            } : null,
            role: employee.role || 'Employee',
            employeeId: employee.id!.slice(-8).toUpperCase(),
            joinDate: employee.joiningDate,
            position: employee.position,
            companyId: employee.companyId,
            managerId: employee.managerId,
        };
    }
}
