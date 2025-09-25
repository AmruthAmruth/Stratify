import { Types } from "mongoose";
import { UserStory } from "../../domain/entities/UserStory";
import { IUserStoryRepository } from "../../domain/repositories/IUserStoryRepository";
import { UserStoryDocument, UserStoryModel } from "../models/UserStoryModel";

export class UserStoryRepository implements IUserStoryRepository {

  async create(userStory: UserStory): Promise<UserStory> {
    const created = await new UserStoryModel({
      title: userStory.title,
      description: userStory.description,
      projectId: new Types.ObjectId(userStory.projectId),
      backlogId: userStory.backlogId ? new Types.ObjectId(userStory.backlogId) : undefined,
      createdBy: new Types.ObjectId(userStory.createdBy),
      priority: userStory.priority,
      status: userStory.status,
      storyPoints: userStory.storyPoints,
      assignedToIds: userStory.assignedToIds?.map(id => new Types.ObjectId(id)),
      acceptanceCriteria: userStory.acceptanceCriteria,
    }).save();

    return this.mapToEntity(created);
  }

  async update(userStory: UserStory): Promise<UserStory> {
    const updated = await UserStoryModel.findByIdAndUpdate(
      new Types.ObjectId(userStory.id),
      {
        title: userStory.title,
        description: userStory.description,
        projectId: new Types.ObjectId(userStory.projectId),
        backlogId: userStory.backlogId ? new Types.ObjectId(userStory.backlogId) : undefined,
        createdBy: new Types.ObjectId(userStory.createdBy),
        priority: userStory.priority,
        status: userStory.status,
        storyPoints: userStory.storyPoints,
        sprintId: userStory.sprintId ? new Types.ObjectId(userStory.sprintId) : undefined,
        assignedToIds: userStory.assignedToIds?.map(id => new Types.ObjectId(id)),
        acceptanceCriteria: userStory.acceptanceCriteria,
        updatedAt: new Date(),
      },
      { new: true }
    ).exec();

    if (!updated) {
      throw new Error("User story not found");
    }

    return this.mapToEntity(updated);
  }

  async findById(id: string): Promise<UserStory | null> {
    const doc = await UserStoryModel.findById(new Types.ObjectId(id)).exec();
    return doc ? this.mapToEntity(doc) : null;
  }

  async findByProject(projectId: string): Promise<UserStory[]> {
    const docs = await UserStoryModel.find({
      projectId: new Types.ObjectId(projectId),
    }).exec();

    return docs.map(this.mapToEntity);
  }

  async delete(id: string): Promise<void> {
    await UserStoryModel.findByIdAndDelete(new Types.ObjectId(id)).exec();
  }



async findByNameAndBackLogId(name: string, backlogId: string): Promise<UserStory | null> {
  const doc = await UserStoryModel.findOne({
    title:name,
    backlogId
  })
return doc ? this.mapToEntity(doc) : null;

}


  private mapToEntity(doc: UserStoryDocument): UserStory {
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
    doc.assignedToIds?.map((id: Types.ObjectId) => id.toString()),
    doc.acceptanceCriteria,
    doc.createdAt,
    doc.updatedAt
  );
}





}
