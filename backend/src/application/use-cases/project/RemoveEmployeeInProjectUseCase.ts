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

        
        const project = await this._projectRepo.findById(projectId);
        if (!project) {
            throw new AppError("Project not found", StatusCodes.NOT_FOUND);
        }

        
        const employee = await this._employeeRepo.findById(employeeId);
        if (!employee) {
            throw new AppError("Employee not found", StatusCodes.NOT_FOUND);
        }

        
        const isInProject = project.teamMemberIds?.includes(employeeId);
        if (!isInProject) {
            throw new AppError(
                "Employee is not part of this project",
                StatusCodes.BAD_REQUEST
            );
        }
        
        const allProjectIssues = await this._issueRepo.findByProjectId(projectId);
        const employeeIssues = allProjectIssues.filter(
            (issue) => issue.assignedTo === employeeId
        );

        for (const issue of employeeIssues) {
            issue.assignedTo = null;
            await this._issueRepo.update(issue);
        }

        project.teamMemberIds = (project.teamMemberIds || []).filter(
            (id) => id !== employeeId
        );

        await this._projectRepo.update(project);

        const employeeNotification = new Notification(
            employee.id!,
            employee.role,
            "Removed from Project",
            `You have been removed from project: ${project.name}`,
            "warning"
        );
        NotificationEmitter.emit(employeeNotification);
        await this._notificationRepo.create(employeeNotification);

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
