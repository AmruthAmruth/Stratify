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
        // Validate sprint exists
        const sprint = await this._sprintRepo.findById(dto.sprintId);
        if (!sprint) {
            throw new AppError(Messages.SPRINT_NOT_FOUND, StatusCodes.NOT_FOUND);
        }

        // Validate employee exists
        const employee = await this._employeeRepo.findById(dto.employeeId);
        if (!employee) {
            throw new AppError(Messages.EMPLOYEE_NOT_FOUND, StatusCodes.NOT_FOUND);
        }

        // Calculate total working days in sprint (excluding weekends)
        const totalWorkingDays = DateUtils.calculateWorkingDays(
            sprint.startDate,
            sprint.endDate
        );

        // Get employee's approved leaves during sprint
        const employeeLeaves = await this._leaveRepo.findApprovedLeavesByEmployeesInRange(
            [dto.employeeId],
            sprint.startDate,
            sprint.endDate
        );

        // Calculate leave days
        const leaveDays = DateUtils.countLeaveDays(
            employeeLeaves.map((leave) => ({
                startDate: leave.startDate,
                endDate: leave.endDate,
            })),
            sprint.startDate,
            sprint.endDate
        );

        // Calculate total availability (working days - leave days)
        const totalAvailability = totalWorkingDays - leaveDays;

        // Get all issues assigned to this employee in this sprint
        const assignedIssues = await this._issueRepo.findBySprintAndAssignee(
            dto.sprintId,
            dto.employeeId
        );

        // Calculate current workload (sum of issue sizes, excluding the issue being updated if specified)
        const currentWorkload = assignedIssues
            .filter((issue) => issue.id !== dto.excludeIssueId)
            .reduce((sum, issue) => sum + issue.size, 0);

        // Calculate what the total would be with the new assignment
        const totalWorkloadAfterAssignment = currentWorkload + dto.additionalSize;

        // Calculate remaining capacity
        const remainingCapacity = totalAvailability - totalWorkloadAfterAssignment;

        // Determine if valid
        const isValid = totalWorkloadAfterAssignment <= totalAvailability;

        // Build result
        const result: EmployeeCapacityValidationResult = {
            isValid,
            employeeName: employee.name,
            totalAvailability,
            currentWorkload,
            additionalSize: dto.additionalSize,
            remainingCapacity,
        };

        // Add error message if invalid
        if (!isValid) {
            result.errorMessage = `Cannot assign issue. ${employee.name} has ${totalAvailability} days availability but would have ${totalWorkloadAfterAssignment} days assigned (current: ${currentWorkload} days, additional: ${dto.additionalSize} days)`;
        }

        return result;
    }
}
