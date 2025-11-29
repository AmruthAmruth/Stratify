import { Issue } from "../../domain/entities/Issue";
import { CreateIssuesDTO } from "../dto/project/CreateIssuesDTO";

export class IssueMapper {

    static toDomain(dto: CreateIssuesDTO): Issue {
        return new Issue(
            undefined,
            dto.heading,
            dto.description,
            dto.acceptanceCriteria,
            dto.size,
            dto.type,
            "Planned",
            dto.priority,
            dto.projectId,
            null,
            dto.assignedTo || null,
        );
    }

    static toResponse(issue: Issue) {
        return {
            id: issue.id,
            heading: issue.heading,
            description: issue.description,
            acceptanceCriteria: issue.acceptanceCriteria,
            size: issue.size,
            type: issue.type,
            status: issue.status,
            priority: issue.priority,
            projectId: issue.projectId,
            sprintId: issue.sprintId,
            assignedTo: issue.assignedTo,
            createdAt: issue.createdAt,
            updatedAt: issue.updatedAt,
        };
    }

    static toListResponse(issues: Issue[]) {
        return issues.map((issue) => this.toResponse(issue));
    }
}
