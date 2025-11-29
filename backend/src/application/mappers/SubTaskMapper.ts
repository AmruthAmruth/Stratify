import { SubTask } from "../../domain/entities/SubTask";
import { CreateSubTaskDTO } from "../dto/project/CreateSubTaskDTO";

export class SubTaskMapper {

    static toDomain(dto: CreateSubTaskDTO): SubTask {
        return new SubTask(
            undefined,
            dto.issueId,
            dto.heading,
            dto.description,
            dto.hours,
            dto.status || "To Do",
            dto.assignedToId || null,
        );
    }

    static toResponse(subTask: SubTask) { 
        return {
            id: subTask.id,
            issueId: subTask.issueId,
            heading: subTask.heading,
            description: subTask.description,
            hours: subTask.hours,
            status: subTask.status,
            assignedToId: subTask.assignedToId,
            createdAt: subTask.createdAt,
            updatedAt: subTask.updatedAt,
        };
    }

    static toListResponse(subTasks: SubTask[]) {
        return subTasks.map((subTask) => this.toResponse(subTask));
    }
}
