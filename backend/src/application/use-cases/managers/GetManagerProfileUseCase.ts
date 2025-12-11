import { IGetManagerProfileUseCase } from "../../interfaces/managers/IGetManagerProfileUseCase";
import { IManagerRepository } from "../../../domain/repositories/IManagerRepository";
import { IProjectRepository } from "../../../domain/repositories/IProjectRepository";
import { ManagerProfileResponse } from "../../interfaces/managers/types";
import { Project } from "../../../domain/entities/Project";
import { AppError } from "../../../interfaces/middleware/ErrorMiddleware";
import { StatusCodes } from "../../../shared/constants/statusCodes";
import { Messages } from "../../../shared/constants/messages";

export class GetManagerProfileUseCase implements IGetManagerProfileUseCase {
    constructor(
        private managerRepository: IManagerRepository,
        private projectRepository: IProjectRepository
    ) { }

    async execute(managerId: string): Promise<ManagerProfileResponse> {
        const manager = await this.managerRepository.findByIdWithDepartment(managerId);

        if (!manager) {
            throw new AppError(Messages.MANAGER_NOT_FOUND, StatusCodes.NOT_FOUND);
        }
        let projects: Partial<Project>[] = [];
        let projectsManaged = 0;
        let teamSize = 0;

        if (manager.departmentId) {
            try {
                projects = await this.projectRepository.findByDepartmentId(manager.departmentId._id.toString());
                projectsManaged = projects.length;


                const employeeSet = new Set<string>();
                projects.forEach((project) => {
                    if (project.teamMemberIds && Array.isArray(project.teamMemberIds)) {
                        project.teamMemberIds.forEach((emp) => {
                            employeeSet.add(emp.toString());
                        });
                    }
                });
                teamSize = employeeSet.size;
            } catch (error) {
                console.error("Error fetching projects:", error);
            }
        }

        return {
            id: manager._id.toString(),
            name: manager.name,
            email: manager.email,
            phone: manager.phone,
            dateOfBirth: manager.dob,
            profileImage: manager.profileImage,
            department: manager.departmentId ? {
                id: manager.departmentId._id.toString(),
                name: manager.departmentId.name
            } : null,
            role: manager.role || 'Manager',
            employeeId: manager._id.toString().slice(-8).toUpperCase(),
            joinDate: manager.joiningDate,
            projectsManaged,
            teamSize,
            companyId: manager.companyId,
        };
    }
}
