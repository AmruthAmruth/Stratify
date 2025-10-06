import { Types } from "mongoose";
import { Sprint } from "../../domain/entities/Sprint";
import { SprintDocument } from "../models/SprintModel";

export class SprintMapper {
  static toEntity(doc: SprintDocument): Sprint {
    return new Sprint(
      doc.id.toString(),
      doc.name,
      doc.goal,
      doc.startDate,
      doc.endDate,
      doc.projectId.toString(),
      doc.status,
      doc.createdAt,
      doc.updatedAt
    );
  }

  static toDocument(sprint: Sprint): Partial<SprintDocument> {
    return {
      name: sprint.name,
      goal: sprint.goal,
      startDate: sprint.startDate,
      endDate: sprint.endDate,
        projectId: new Types.ObjectId(sprint.projectId),
      status: sprint.status,
    };
  }
}
