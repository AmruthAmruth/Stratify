import { ISprintRepository } from "../../../domain/repositories/ISprintRepository";
import { IProjectRepository } from "../../../domain/repositories/IProjectRepository";
import { ILeaveRepository } from "../../../domain/repositories/ILeaveRepository";
import { IEmployeeRepository } from "../../../domain/repositories/IEmployeeRepository";
import { AppError } from "../../../interfaces/middleware/ErrorMiddleware";
import { Messages } from "../../../shared/constants/messages";
import { StatusCodes } from "../../../shared/constants/statusCodes";
import {
    SprintCapacityDTO,
    EmployeeCapacityDTO,
} from "../../dto/project/SprintCapacityDTO";
import { ICalculateSprintCapacityUseCase } from "../../interfaces/project/ICalculateSprintCapacityUseCase";
import { DateUtils } from "../../../shared/utils/DateUtils";
import { Sprint } from "../../../domain/entities/Sprint";

export class CalculateSprintCapacityUseCase
    implements ICalculateSprintCapacityUseCase {
    constructor(
        private _sprintRepo: ISprintRepository,
        private _projectRepo: IProjectRepository,
        private _leaveRepo: ILeaveRepository,
        private _employeeRepo: IEmployeeRepository
    ) { }

    async execute(sprintId: string): Promise<SprintCapacityDTO> {
        // 1. Fetch sprint and validate existence
        const sprint = await this._sprintRepo.findById(sprintId);
        if (!sprint) {
            throw new AppError(Messages.SPRINT_NOT_FOUND, StatusCodes.NOT_FOUND);
        }

        // 2. Get project and extract team member IDs
        const project = await this._projectRepo.findById(sprint.projectId);
        if (!project) {
            throw new AppError(Messages.PROJECT_NOT_FOUND, StatusCodes.NOT_FOUND);
        }

        const teamMemberIds = project.teamMemberIds || [];
        if (teamMemberIds.length === 0) {
            // Return empty capacity if no team members
            return this._createEmptyCapacity(sprint as Sprint & { id: string });
        }

        // 3. Calculate total working days in sprint (exclude weekends)
        const totalWorkingDays = DateUtils.calculateWorkingDays(
            sprint.startDate,
            sprint.endDate
        );

        // 4. Fetch all approved leaves for team members in sprint date range
        const allLeaves = await this._leaveRepo.findApprovedLeavesByEmployeesInRange(
            teamMemberIds,
            sprint.startDate,
            sprint.endDate
        );

        // 5. Fetch employee details
        const employees = await Promise.all(
            teamMemberIds.map((id) => this._employeeRepo.findById(id))
        );

        // Filter out any null employees
        const validEmployees = employees.filter((emp) => emp !== null);

        // 6. Calculate capacity for each employee
        const employeeCapacities: EmployeeCapacityDTO[] = validEmployees.map(
            (employee) => {
                const employeeLeaves = allLeaves.filter(
                    (leave) => leave.employeeId === employee!.id
                );

                const leaveDays = DateUtils.countLeaveDays(
                    employeeLeaves.map((leave) => ({
                        startDate: leave.startDate,
                        endDate: leave.endDate,
                    })),
                    sprint.startDate,
                    sprint.endDate
                );

                const totalHours = totalWorkingDays * 8;
                const leaveHours = leaveDays * 8;
                const availableHours = totalHours - leaveHours;
                const utilizationPercent =
                    totalHours > 0 ? (availableHours / totalHours) * 100 : 0;

                return {
                    employeeId: employee!.id!,
                    name: employee!.name,
                    position: employee!.position,
                    totalHours,
                    leaveHours,
                    availableHours,
                    utilizationPercent: Math.round(utilizationPercent * 100) / 100, // Round to 2 decimal places
                    leaves: employeeLeaves.map((leave) => ({
                        startDate: leave.startDate,
                        endDate: leave.endDate,
                        type: leave.type,
                    })),
                };
            }
        );

        // 7. Aggregate team summary statistics
        const totalCapacity = employeeCapacities.reduce(
            (sum, emp) => sum + emp.totalHours,
            0
        );
        const availableCapacity = employeeCapacities.reduce(
            (sum, emp) => sum + emp.availableHours,
            0
        );
        const leaveLoss = employeeCapacities.reduce(
            (sum, emp) => sum + emp.leaveHours,
            0
        );
        const availabilityPercent =
            totalCapacity > 0 ? (availableCapacity / totalCapacity) * 100 : 0;

        // 8. Return complete capacity DTO
        return {
            sprintId: sprint.id!,
            sprintName: sprint.name,
            startDate: sprint.startDate,
            endDate: sprint.endDate,
            totalWorkingDays,
            employees: employeeCapacities,
            teamSummary: {
                totalCapacity,
                availableCapacity,
                leaveLoss,
                availabilityPercent: Math.round(availabilityPercent * 100) / 100,
            },
        };
    }

    /**
     * Create an empty capacity response for sprints with no team members
     */
    private _createEmptyCapacity(sprint: Sprint & { id: string }): SprintCapacityDTO {
        const totalWorkingDays = DateUtils.calculateWorkingDays(
            sprint.startDate,
            sprint.endDate
        );

        return {
            sprintId: sprint.id,
            sprintName: sprint.name,
            startDate: sprint.startDate,
            endDate: sprint.endDate,
            totalWorkingDays,
            employees: [],
            teamSummary: {
                totalCapacity: 0,
                availableCapacity: 0,
                leaveLoss: 0,
                availabilityPercent: 0,
            },
        };
    }
}
