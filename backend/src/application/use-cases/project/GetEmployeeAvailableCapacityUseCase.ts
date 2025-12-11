import { ISprintRepository } from "../../../domain/repositories/ISprintRepository";
import { IEmployeeRepository } from "../../../domain/repositories/IEmployeeRepository";
import { ILeaveRepository } from "../../../domain/repositories/ILeaveRepository";
import { IIssueRepository } from "../../../domain/repositories/IIssueRepository";
import { AppError } from "../../../interfaces/middleware/ErrorMiddleware";
import { Messages } from "../../../shared/constants/messages";
import { StatusCodes } from "../../../shared/constants/statusCodes";
import { EmployeeAvailableCapacityDTO } from "../../dto/project/EmployeeAvailableCapacityDTO";
import { IGetEmployeeAvailableCapacityUseCase } from "../../interfaces/project/IGetEmployeeAvailableCapacityUseCase";
import { DateUtils } from "../../../shared/utils/DateUtils";

export class GetEmployeeAvailableCapacityUseCase implements IGetEmployeeAvailableCapacityUseCase {
    constructor(
        private _sprintRepo: ISprintRepository,
        private _employeeRepo: IEmployeeRepository,
        private _leaveRepo: ILeaveRepository,
        private _issueRepo: IIssueRepository
    ) { }

    async execute(employeeId: string, sprintId: string): Promise<EmployeeAvailableCapacityDTO> {
        // 1. Validate employee exists
        const employee = await this._employeeRepo.findById(employeeId);
        if (!employee) {
            throw new AppError(Messages.EMPLOYEE_NOT_FOUND, StatusCodes.NOT_FOUND);
        }

        // 2. Validate sprint exists
        const sprint = await this._sprintRepo.findById(sprintId);
        if (!sprint) {
            throw new AppError(Messages.SPRINT_NOT_FOUND, StatusCodes.NOT_FOUND);
        }

        // 3. Calculate total working days in sprint (excluding weekends)
        const totalWorkingDays = DateUtils.calculateWorkingDays(
            sprint.startDate,
            sprint.endDate
        );
        const totalSprintHours = totalWorkingDays * 8;

        // 4. Get approved leaves for employee during sprint period
        const leaves = await this._leaveRepo.findApprovedLeavesByEmployeesInRange(
            [employeeId],
            sprint.startDate,
            sprint.endDate
        );

        // 5. Calculate leave hours
        const leaveDays = DateUtils.countLeaveDays(
            leaves.map(leave => ({
                startDate: leave.startDate,
                endDate: leave.endDate
            })),
            sprint.startDate,
            sprint.endDate
        );
        const leaveHours = leaveDays * 8;

        // 6. Get all issues assigned to this employee in this sprint
        const issues = await this._issueRepo.findBySprintAndAssignee(sprintId, employeeId);

        // 7. Calculate total assigned hours
        const assignedHours = issues.reduce((sum, issue) => sum + issue.estimatedHours, 0);

        // 8. Calculate available hours
        const availableHours = totalSprintHours - leaveHours - assignedHours;

        // 9. Calculate utilization percentage
        const utilizationPercent = totalSprintHours > 0
            ? ((totalSprintHours - availableHours) / totalSprintHours) * 100
            : 0;

        return {
            employeeId: employee.id!,
            name: employee.name,
            position: employee.position,
            totalSprintHours,
            leaveHours,
            assignedHours,
            availableHours,
            utilizationPercent: Math.round(utilizationPercent * 100) / 100
        };
    }
}
