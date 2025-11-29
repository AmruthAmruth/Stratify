import { Sprint } from "../../domain/entities/Sprint";
import { CreateSprintDTO } from "../dto/project/CreateSprintDTO";

export class SprintMapper {

    static toDomain(dto: CreateSprintDTO): Sprint {
        const sprintStart = new Date(dto.startDate);
        const sprintEnd = new Date(dto.endDate);

        return new Sprint(
            undefined,
            dto.name,
            dto.goal,
            sprintStart,
            sprintEnd,
            dto.projectId,
            dto.status ?? "Planned",
        );
    }

    static toResponse(sprint: Sprint) {
        return {
            id: sprint.id,
            name: sprint.name,
            goal: sprint.goal,
            startDate: sprint.startDate,
            endDate: sprint.endDate,
            projectId: sprint.projectId,
            status: sprint.status,
            createdAt: sprint.createdAt,
            updatedAt: sprint.updatedAt,
        };
    }

    static toListResponse(sprints: Sprint[]) {
        return sprints.map((sprint) => this.toResponse(sprint));
    }
}
