import { Types } from "mongoose";
import { UserStoryDocument } from "../models/UserStoryModel";
import { UserStory } from "../../domain/entities/UserStory";

export class UserStoryMapper {
    
  static toEntity(doc: UserStoryDocument): UserStory {
    return new UserStory(
      doc.id.toString(),
      doc.title,
      doc.description,
      doc.projectId.toString(),
      doc.backlogId ? doc.backlogId.toString() : "",
      doc.createdBy.toString(),
      doc.priority,
      doc.status,
      doc.storyPoints,
      doc.sprintId?.toString(),
      doc.assignedToIds?.map((id: Types.ObjectId) => id.toString()) || [],
      doc.acceptanceCriteria,
      doc.createdAt,
      doc.updatedAt
    );
  }

  
  static toDocument(userStory: UserStory) {
    return {
      title: userStory.title,
      description: userStory.description,
      projectId: new Types.ObjectId(userStory.projectId),
      backlogId: userStory.backlogId ? new Types.ObjectId(userStory.backlogId) : undefined,
      createdBy: new Types.ObjectId(userStory.createdBy),
      priority: userStory.priority,
      status: userStory.status,
      storyPoints: userStory.storyPoints,
      sprintId: userStory.sprintId ? new Types.ObjectId(userStory.sprintId) : undefined,
      assignedToIds: userStory.assignedToIds?.map(id => new Types.ObjectId(id)) || [],
      acceptanceCriteria: userStory.acceptanceCriteria,
    };
  }
}
