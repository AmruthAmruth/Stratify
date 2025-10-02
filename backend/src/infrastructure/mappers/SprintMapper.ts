import { HydratedDocument, Types } from "mongoose";
import { SprintDocument } from "../models/SprintModel";
import { Sprint } from "../../domain/entities/Sprint";

export class SprintMapper {
  static toEntity(doc: HydratedDocument<SprintDocument>): Sprint {
    return new Sprint(
      doc.id.toString(),
      doc.name,
      doc.description,
      doc.projectId.toString(),
      doc.startDate,
      doc.endDate,
      doc.status,
      doc.teamCapacity,
      doc.totalStoryPoints,
      doc.createdBy.toString(),
      doc.userStoryIds?.map((id) => id.toString()) || [],
      doc.createdAt,
      doc.updatedAt
    );
  }

  static toDocument(sprint: Sprint) {
    return {
      name: sprint.name,
      description: sprint.description,
      projectId: new Types.ObjectId(sprint.projectId),
      startDate: sprint.startDate,
      endDate: sprint.endDate,
      status: sprint.status ?? "Planned",
      teamCapacity: sprint.teamCapacity,
      totalStoryPoints: sprint.totalStoryPoints ?? 0,
      createdBy: new Types.ObjectId(sprint.createdBy),
      userStoryIds: sprint.userStoryIds?.map((id) => new Types.ObjectId(id)) || [],
    };
  }
}