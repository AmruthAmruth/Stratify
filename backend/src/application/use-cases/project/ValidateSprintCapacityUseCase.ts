import { ISprintRepository } from "../../../domain/repositories/ISprintRepository";
import { IProjectRepository } from "../../../domain/repositories/IProjectRepository";
import { IIssueRepository } from "../../../domain/repositories/IIssueRepository";
import { IEmployeeRepository } from "../../../domain/repositories/IEmployeeRepository";
import { ILeaveRepository } from "../../../domain/repositories/ILeaveRepository";
import { AppError } from "../../../interfaces/middleware/ErrorMiddleware";
import { Messages } from "../../../shared/constants/messages";
import { StatusCodes } from "../../../shared/constants/statusCodes";
import { SprintValidationDTO, OvercommittedEmployee } from "../../dto/project/SprintValidationDTO";
import { IValidateSprintCapacityUseCase } from "../../interfaces/project/IValidateSprintCapacityUseCase";
import { DateUtils } from "../../../shared/utils/DateUtils";

export class ValidateSprintCapacityUseCase implements IValidateSprintCapacityUseCase {
    constructor(
        private _sprintRepo: ISprintRepository,
        private _projectRepo: IProjectRepository,
        private _issueRepo: IIssueRepository,
        private _employeeRepo: IEmployeeRepository,
        private _leaveRepo: ILeaveRepository
    ) { }

    async execute(sprintId: string): Promise<SprintValidationDTO> {
        // 1. Validate sprint exists
        const sprint = await this._sprintRepo.findById(sprintId);
        if (!sprint) {
            throw new AppError(Messages.SPRINT_NOT_FOUND, StatusCodes.NOT_FOUND);
        }

        // 2. Get project and team members
        const project = await this._projectRepo.findById(sprint.projectId);
        if (!project) {
            throw new AppError(Messages.PROJECT_NOT_FOUND, StatusCodes.NOT_FOUND);
        }

        const teamMemberIds = project.teamMemberIds || [];
        if (teamMemberIds.length === 0) {
            return {
                isValid: true,
                totalRequiredHours: 0,
                totalAvailableHours: 0,
                overcommittedEmployees: [],
                warnings: ["No team members assigned to this project"]
            };
        }

        // 3. Calculate total working days in sprint
        const totalWorkingDays = DateUtils.calculateWorkingDays(
            sprint.startDate,
            sprint.endDate
        );

        // 4. Get all issues in this sprint
        const sprintIssues = await this._issueRepo.findBySprintId(sprintId);

        // 5. Get all approved leaves for team members in sprint date range
        const allLeaves = await this._leaveRepo.findApprovedLeavesByEmployeesInRange(
            teamMemberIds,
            sprint.startDate,
            sprint.endDate
        );

        // 6. Calculate capacity and requirements for each employee
        const overcommittedEmployees: OvercommittedEmployee[] = [];
        let totalRequiredHours = 0;
        let totalAvailableHours = 0;

        for (const employeeId of teamMemberIds) {
            const employee = await this._employeeRepo.findById(employeeId);
            if (!employee) continue;

            // Calculate employee's total sprint hours (excluding weekends)
            const employeeTotalHours = totalWorkingDays * 8;

            // Calculate employee's leave hours
            const employeeLeaves = allLeaves.filter(leave => leave.employeeId === employeeId);
            const leaveDays = DateUtils.countLeaveDays(
                employeeLeaves.map(leave => ({
                    startDate: leave.startDate,
                    endDate: leave.endDate
                })),
                sprint.startDate,
                sprint.endDate
            );
            const leaveHours = leaveDays * 8;

            // Calculate employee's available hours
            const availableHours = employeeTotalHours - leaveHours;

            // Calculate employee's assigned hours
            const assignedIssues = sprintIssues.filter(issue => issue.assignedTo === employeeId);
            const requiredHours = assignedIssues.reduce((sum, issue) => sum + issue.estimatedHours, 0);

            totalRequiredHours += requiredHours;
            totalAvailableHours += availableHours;

            // Check if employee is overcommitted
            if (requiredHours > availableHours) {
                overcommittedEmployees.push({
                    employeeId: employee.id!,
                    name: employee.name,
                    requiredHours,
                    availableHours,
                    deficit: requiredHours - availableHours
                });
            }
        }

        // 7. Generate warnings
        const warnings: string[] = [];

        if (overcommittedEmployees.length > 0) {
            warnings.push(`${overcommittedEmployees.length} team member(s) are overcommitted`);
        }

        const utilizationPercent = totalAvailableHours > 0
            ? (totalRequiredHours / totalAvailableHours) * 100
            : 0;

        if (utilizationPercent > 100) {
            warnings.push(`Sprint is ${Math.round(utilizationPercent - 100)}% over capacity`);
        } else if (utilizationPercent > 80) {
            warnings.push(`Sprint is at ${Math.round(utilizationPercent)}% capacity (high utilization)`);
        }

        if (allLeaves.length > 0) {
            const totalLeaveDays = allLeaves.reduce((sum, leave) => {
                const days = DateUtils.countLeaveDays(
                    [{ startDate: leave.startDate, endDate: leave.endDate }],
                    sprint.startDate,
                    sprint.endDate
                );
                return sum + days;
            }, 0);
            warnings.push(`${allLeaves.length} approved leave(s) affecting ${totalLeaveDays} working days`);
        }

        return {
            isValid: overcommittedEmployees.length === 0,
            totalRequiredHours,
            totalAvailableHours,
            overcommittedEmployees,
            warnings
        };
    }
}
