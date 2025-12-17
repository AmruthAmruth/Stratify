import { IIssueRepository } from "../../../domain/repositories/IIssueRepository";
import { IManagerRepository } from "../../../domain/repositories/IManagerRepository";
import { IProjectRepository } from "../../../domain/repositories/IProjectRepository";
import { EmployeeIssueDTO } from "../../dto/project/EmployeeIssueDTO";
import { IGetIssuesForManagerUseCase } from "../../interfaces/project/IGetIssuesForManagerUseCase";
import { AppError } from "../../../interfaces/middleware/ErrorMiddleware";
import { StatusCodes } from "../../../shared/constants/statusCodes";
import { Messages } from "../../../shared/constants/messages";

export class GetIssuesForManagerUseCase implements IGetIssuesForManagerUseCase {
    constructor(
        private readonly _issueRepo: IIssueRepository,
        private readonly _managerRepo: IManagerRepository,
        private readonly _projectRepo: IProjectRepository
    ) { }

    async execute(managerId: string): Promise<EmployeeIssueDTO[]> {
        // Get manager to find their department
        const manager = await this._managerRepo.findById(managerId);
        if (!manager) {
            throw new AppError(Messages.MANAGER_NOT_FOUND, StatusCodes.NOT_FOUND);
        }

        if (!manager.departmentId) {
            throw new AppError("Manager has no department assigned", StatusCodes.BAD_REQUEST);
        }

        // Get all projects in the manager's department
        const projects = await this._projectRepo.findByDepartmentId(manager.departmentId);

        if (!projects || projects.length === 0) {
            return [];
        }

        // Get all issues for these projects
        const allIssues: EmployeeIssueDTO[] = [];

        for (const project of projects) {
            if (project.id) {
                const projectIssues = await this._issueRepo.findAllByProject(project.id);

                // For each issue, we need to fetch the full details with subtasks
                for (const issue of projectIssues) {
                    if (issue.assignedTo) {
                        const issueDetails = await this._issueRepo.findByUserId(issue.assignedTo);
                        // Filter to only include this specific issue
                        const specificIssue = issueDetails.find(i => i.id === issue.id);
                        if (specificIssue) {
                            allIssues.push(specificIssue);
                        }
                    }
                }
            }
        }

        return allIssues;
    }
}
