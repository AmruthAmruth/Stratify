import { ISprintRepository } from "../../../domain/repositories/ISprintRepository";
import { IEmployeeRepository } from "../../../domain/repositories/IEmployeeRepository";
import { ILeaveRepository } from "../../../domain/repositories/ILeaveRepository";
import { IIssueRepository } from "../../../domain/repositories/IIssueRepository";
import { AppError } from "../../../interfaces/middleware/ErrorMiddleware";
import { Messages } from "../../../shared/constants/messages";
import { StatusCodes } from "../../../shared/constants/statusCodes";
import { DateUtils } from "../../../shared/utils/DateUtils";
import { IValidateEmployeeCapacityUseCase } from "../../interfaces/project/IValidateEmployeeCapacityUseCase";
import {
    ValidateEmployeeCapacityDTO,
    EmployeeCapacityValidationResult,
} from "../../dto/project/EmployeeCapacityValidationDTO";

export class ValidateEmployeeCapacityUseCase implements IValidateEmployeeCapacityUseCase {
    constructor(
        private _sprintRepo: ISprintRepository,
        private _employeeRepo: IEmployeeRepository,
        private _leaveRepo: ILeaveRepository,
        private _issueRepo: IIssueRepository
    ) { }

    async execute(dto: ValidateEmployeeCapacityDTO): Promise<EmployeeCapacityValidationResult> {
        
        const sprint = await this._sprintRepo.findById(dto.sprintId);
        if (!sprint) {
            throw new AppError(Messages.SPRINT_NOT_FOUND, StatusCodes.NOT_FOUND);
        }

        
        const employee = await this._employeeRepo.findById(dto.employeeId);
        if (!employee) {
            throw new AppError(Messages.EMPLOYEE_NOT_FOUND, StatusCodes.NOT_FOUND);
        }

        
        const totalWorkingDays = DateUtils.calculateWorkingDays(
            sprint.startDate,
            sprint.endDate
        );

        
        const employeeLeaves = await this._leaveRepo.findApprovedLeavesByEmployeesInRange(
            [dto.employeeId],
            sprint.startDate,
            sprint.endDate
        );

        
        const leaveDays = DateUtils.countLeaveDays(
            employeeLeaves.map((leave) => ({
                startDate: leave.startDate,
                endDate: leave.endDate,
            })),
            sprint.startDate,
            sprint.endDate
        );

        
        const totalAvailability = totalWorkingDays - leaveDays;

        
        const assignedIssues = await this._issueRepo.findBySprintAndAssignee(
            dto.sprintId,
            dto.employeeId
        );

        
        const currentWorkload = assignedIssues
            .filter((issue) => issue.id !== dto.excludeIssueId)
            .reduce((sum, issue) => sum + issue.size, 0);

        
        const totalWorkloadAfterAssignment = currentWorkload + dto.additionalSize;

        
        const remainingCapacity = totalAvailability - totalWorkloadAfterAssignment;

        
        const isValid = totalWorkloadAfterAssignment <= totalAvailability;

        
        const result: EmployeeCapacityValidationResult = {
            isValid,
            employeeName: employee.name,
            totalAvailability,
            currentWorkload,
            additionalSize: dto.additionalSize,
            remainingCapacity,
        };

        
        if (!isValid) {
            result.errorMessage = `Cannot assign issue. ${employee.name} has ${totalAvailability} days availability but would have ${totalWorkloadAfterAssignment} days assigned (current: ${currentWorkload} days, additional: ${dto.additionalSize} days)`;
        }

        return result;
    }
}
