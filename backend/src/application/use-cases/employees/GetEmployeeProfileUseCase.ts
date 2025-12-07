import { IGetEmployeeProfileUseCase, EmployeeProfileResponse } from "../../interfaces/employees/IGetEmployeeProfileUseCase";
import { IEmployeeRepository } from "../../../domain/repositories/IEmployeeRepository";

export class GetEmployeeProfileUseCase implements IGetEmployeeProfileUseCase {
    constructor(
        private employeeRepository: IEmployeeRepository
    ) { }

    async execute(employeeId: string): Promise<EmployeeProfileResponse> {
        const employee = await this.employeeRepository.findByIdWithDepartment(employeeId);

        if (!employee) {
            throw new Error("Employee not found");
        }

        return {
            id: employee._id.toString(),
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
            employeeId: employee._id.toString().slice(-8).toUpperCase(),
            joinDate: employee.joiningDate,
            position: employee.position,
            companyId: employee.companyId,
            managerId: employee.managerId,
        };
    }
}
