import { IProjectRepository } from "../../../domain/repositories/IProjectRepository";
import { IEmployeeRepository } from "../../../domain/repositories/IEmployeeRepository";
import { AppError } from "../../../interfaces/middleware/ErrorMiddleware";
import { StatusCodes } from "../../../shared/constants/statusCodes";
import { Messages } from "../../../shared/constants/messages";
import {
    GetProjectsForEmployeeDTO,
    GetProjectsForEmployeeResponse,
} from "../../dto/project/GetProjectsForEmployeeDTO";
import { IGetProjectsForEmployeeUseCase } from "../../interfaces/project/IGetProjectsForEmployeeUseCase";

export class GetProjectsForEmployeeUseCase
    implements IGetProjectsForEmployeeUseCase {
    constructor(
        private _projectRepo: IProjectRepository,
        private _employeeRepo: IEmployeeRepository,
    ) { }

    async execute(employeeId: string): Promise<GetProjectsForEmployeeResponse> {
        const employee = await this._employeeRepo.findById(employeeId);

        if (!employee) {
            throw new AppError(Messages.EMPLOYEE_NOT_FOUND, StatusCodes.NOT_FOUND);
        }

        // Get all projects where employee is a team member
        const projects = await this._projectRepo.findByTeamMemberId(employeeId);

        if (!projects || projects.length === 0) {
            throw new AppError(Messages.PROJECT_NOT_FOUND, StatusCodes.NOT_FOUND);
        }

        const counts = {
            total: projects.length,
            planned: 0,
            active: 0,
            completed: 0,
            archived: 0,
        };

        const result: GetProjectsForEmployeeDTO[] = projects.map((project) => {
            const remainingTimeInDays = project.endDate
                ? Math.ceil(
                    (new Date(project.endDate).getTime() - new Date().getTime()) /
                    (1000 * 60 * 60 * 24),
                )
                : 0;

            const status = project.status ?? "Planned";

            if (status === "Planned") counts.planned++;
            if (status === "Active") counts.active++;
            if (status === "Completed") counts.completed++;
            if (status === "Archived") counts.archived++;

            return {
                id: project.id,
                projectName: project.name ?? "Unnamed Project",
                projectDescription: project.description ?? "No description",
                status,
                remainingTimeInDays,
            };
        });

        return { projects: result, employeeId, counts };
    }
}
