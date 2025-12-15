import { IEmployeeRepository } from "../../../domain/repositories/IEmployeeRepository";
import { Employee } from "../../../domain/entities/Employee";
import { IUpdateEmployeeProfileUseCase } from "../../interfaces/employees/IUpdateEmployeeProfileUseCase";
import { AppError } from "../../../interfaces/middleware/ErrorMiddleware";
import { StatusCodes } from "../../../shared/constants/statusCodes";
import { Messages } from "../../../shared/constants/messages";

export class UpdateEmployeeProfileUseCase implements IUpdateEmployeeProfileUseCase {
    constructor(private _employeeRepository: IEmployeeRepository) { }

    async execute(id: string, data: Partial<Employee>): Promise<Employee> {
        const employee = await this._employeeRepository.findById(id);

        if (!employee) {
            throw new AppError(Messages.EMPLOYEE_NOT_FOUND, StatusCodes.NOT_FOUND);
        }

        
        
        if (data.phone) employee.phone = data.phone;
        if (data.profileImage) employee.profileImage = data.profileImage;
        

        return await this._employeeRepository.update(employee);
    }
}
