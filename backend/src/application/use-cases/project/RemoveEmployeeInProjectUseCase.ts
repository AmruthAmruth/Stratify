import { IProjectRepository } from "../../../domain/repositories/IProjectRepository";
import { IIssueRepository } from "../../../domain/repositories/IIssueRepository";
import { IEmployeeRepository } from "../../../domain/repositories/IEmployeeRepository";
import { INotificationRepository } from "../../../domain/repositories/INotificationRepository";
import { AppError } from "../../../interfaces/middleware/ErrorMiddleware";
import { StatusCodes } from "../../../shared/constants/statusCodes";
import { Notification } from "../../../domain/entities/Notification";
import { NotificationEmitter } from "../../../shared/events/NotificationEmitter";
import { IRemoveEmployeeInProjectUseCase } from "../../interfaces/project/IRemoveEmployeeINProjectUseCase";

export class RemoveEmployeeInProjectUseCase implements IRemoveEmployeeInProjectUseCase {
    constructor(
        private _projectRepo: IProjectRepository,
        private _issueRepo: IIssueRepository,
        private _employeeRepo: IEmployeeRepository,
        private _notificationRepo: INotificationRepository
    ) { }

    async execute(projectId: string, employeeId: string): Promise<void> {

        // 1. Get the project
        const project = await this._projectRepo.findById(projectId);
        if (!project) {
            throw new AppError("Project not found", StatusCodes.NOT_FOUND);
        }

        // 2. Verify employee exists
        const employee = await this._employeeRepo.findById(employeeId);
        if (!employee) {
            throw new AppError("Employee not found", StatusCodes.NOT_FOUND);
        }

        // 3. Check if employee is actually in the project
        const isInProject = project.teamMemberIds?.includes(employeeId);
        if (!isInProject) {
            throw new AppError(
                "Employee is not part of this project",
                StatusCodes.BAD_REQUEST
            );
        }

        // 4. Find all issues assigned to this employee in this project
        const allProjectIssues = await this._issueRepo.findByProjectId(projectId);
        const employeeIssues = allProjectIssues.filter(
            (issue) => issue.assignedTo === employeeId
        );

        // 5. Unassign all issues from this employee
        for (const issue of employeeIssues) {
            issue.assignedTo = null;
            await this._issueRepo.update(issue);
        }

        // 6. Remove employee from teamMemberIds
        project.teamMemberIds = (project.teamMemberIds || []).filter(
            (id) => id !== employeeId
        );

        // 7. Save the updated project
        await this._projectRepo.update(project);

        // 8. Notify the removed employee
        const employeeNotification = new Notification(
            employee.id!,
            employee.role,
            "Removed from Project",
            `You have been removed from project: ${project.name}`,
            "warning"
        );
        NotificationEmitter.emit(employeeNotification);
        await this._notificationRepo.create(employeeNotification);

        // 9. If there were assigned issues, notify the project manager
        if (employeeIssues.length > 0 && project.projectLeadId) {
            const manager = await this._employeeRepo.findById(project.projectLeadId);
            if (manager) {
                const managerNotification = new Notification(
                    manager.id!,
                    manager.role,
                    "Issues Unassigned",
                    `⚠️ ${employeeIssues.length} issue(s) were unassigned from ${employee.name} who was removed from project "${project.name}". Please reassign these issues.`,
                    "warning"
                );
                NotificationEmitter.emit(managerNotification);
                await this._notificationRepo.create(managerNotification);
            }
        }
    }
}
