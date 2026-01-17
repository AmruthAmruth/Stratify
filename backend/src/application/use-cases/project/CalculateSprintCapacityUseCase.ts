import { ISprintRepository } from "../../../domain/repositories/ISprintRepository";
import { IProjectRepository } from "../../../domain/repositories/IProjectRepository";
import { ILeaveRepository } from "../../../domain/repositories/ILeaveRepository";
import { IEmployeeRepository } from "../../../domain/repositories/IEmployeeRepository";
import { IIssueRepository } from "../../../domain/repositories/IIssueRepository";
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
        private _employeeRepo: IEmployeeRepository,
        private _issueRepo: IIssueRepository
    ) { }

    async execute(sprintId: string): Promise<SprintCapacityDTO> {

        const sprint = await this._sprintRepo.findById(sprintId);
        if (!sprint) {
            throw new AppError(Messages.SPRINT_NOT_FOUND, StatusCodes.NOT_FOUND);
        }


        const project = await this._projectRepo.findById(sprint.projectId);
        if (!project) {
            throw new AppError(Messages.PROJECT_NOT_FOUND, StatusCodes.NOT_FOUND);
        }

        const teamMemberIds = project.teamMemberIds || [];
        if (teamMemberIds.length === 0) {

            return this._createEmptyCapacity(sprint as Sprint & { id: string });
        }


        const totalWorkingDays = DateUtils.calculateWorkingDays(
            sprint.startDate,
            sprint.endDate
        );


        const allLeaves = await this._leaveRepo.findApprovedLeavesByEmployeesInRange(
            teamMemberIds,
            sprint.startDate,
            sprint.endDate
        );


        const employees = await Promise.all(
            teamMemberIds.map((id) => this._employeeRepo.findById(id))
        );


        const validEmployees = employees.filter((emp) => emp !== null);

        
        const sprintIssues = await this._issueRepo.findBySprintId(sprintId);


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

                
                const assignedIssues = sprintIssues.filter(
                    (issue) => issue.assignedTo === employee!.id
                );
                const assignedHours = assignedIssues.reduce(
                    (sum, issue) => sum + (issue.size * 8),
                    0
                );

                
                const remainingHours = availableHours - assignedHours;

                
                const workloadPercent = availableHours > 0
                    ? (assignedHours / availableHours) * 100
                    : 0;

                const utilizationPercent =
                    totalHours > 0 ? (availableHours / totalHours) * 100 : 0;

                return {
                    employeeId: employee!.id!,
                    name: employee!.name,
                    position: employee!.position,
                    totalHours,
                    leaveHours,
                    availableHours,
                    assignedHours,
                    remainingHours,
                    utilizationPercent: Math.round(utilizationPercent * 100) / 100,
                    workloadPercent: Math.round(workloadPercent * 100) / 100,
                    leaves: employeeLeaves.map((leave) => ({
                        startDate: leave.startDate,
                        endDate: leave.endDate,
                        type: leave.type,
                    })),
                };
            }
        );


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
