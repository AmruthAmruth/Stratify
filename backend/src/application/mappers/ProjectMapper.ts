import { Project } from "../../domain/entities/Project";
import { CreateProjectDTO } from "../dto/project/CreateProjectDTO";

export class ProjectMapper {

    static toDomain(
        dto: CreateProjectDTO,
        companyId: string,
        createdByModel: "Company" | "Manager",
        projectLeadId: string,
    ): Project {
        const now = new Date();

        return new Project(
            undefined,
            dto.name,
            dto.key,
            dto.description ?? "",
            dto.startDate,
            dto.endDate,
            dto.status ?? "Planned",
            dto.departmentId,
            projectLeadId,
            dto.createdBy,
            createdByModel,
            companyId,
            dto.teamMemberIds ?? [],
            now,
            now
        );
    }

    static toResponse(project: Project) {
        return {
            id: project.id,
            name: project.name,
            key: project.key,
            description: project.description,
            startDate: project.startDate,
            endDate: project.endDate,
            status: project.status,
            departmentId: project.departmentId,
            projectLeadId: project.projectLeadId,
            createdBy: project.createdBy,
            createdByModel: project.createdByModel,
            companyId: project.companyId,
            teamMemberIds: project.teamMemberIds,
            createdAt: project.createdAt,
            updatedAt: project.updatedAt,
        };
    }

    static toListResponse(projects: Project[]) {
        return projects.map((project) => this.toResponse(project));
    }
}
