import { Types } from "mongoose";
import { UserStory } from "../../domain/entities/UserStory";
import { IUserStoryRepository } from "../../domain/repositories/IUserStoryRepository";
import { UserStoryModel } from "../models/UserStoryModel";

export class UserStoryRepository implements IUserStoryRepository {

  async create(userStory: UserStory): Promise<UserStory> {
    const created = await new UserStoryModel({
      title: userStory.title,
      description: userStory.description,
      projectId: new Types.ObjectId(userStory.projectId),
      createdBy: new Types.ObjectId(userStory.createdBy),
      priority: userStory.priority,
      status: userStory.status,
      storyPoints: userStory.storyPoints,
      capacity: userStory.capacity,
      assignedTo: userStory.assignedTo
        ? new Types.ObjectId(userStory.assignedTo)
        : null,
       sprintId: userStory.sprintId
        ? new Types.ObjectId(userStory.sprintId)
        : null,
    }).save();

    return new UserStory(
      created.id.toString(),
      created.title,
      created.description,
      created.projectId.toString(),
      created.createdBy.toString(),
      created.priority,
      created.status,
      created.storyPoints,
      created.capacity,
      created.assignedTo?.toString(),
      created.sprintId?.toString(),
      created.createdAt,
      created.updatedAt
    );
  }

  async update(userStory: UserStory): Promise<UserStory> {
    const updated = await UserStoryModel.findByIdAndUpdate(
      new Types.ObjectId(userStory.id),
      {
        title: userStory.title,
        description: userStory.description,
        projectId: new Types.ObjectId(userStory.projectId),
        createdBy: new Types.ObjectId(userStory.createdBy),
        priority: userStory.priority,
        status: userStory.status,
        storyPoints: userStory.storyPoints,
        capacity: userStory.capacity,
        assignedTo: userStory.assignedTo
          ? new Types.ObjectId(userStory.assignedTo)
          : null,
          sprintId: userStory.sprintId
        ? new Types.ObjectId(userStory.sprintId)
        : null,
        updatedAt: new Date(),
      },
      { new: true }
    ).exec();

    if (!updated) {
      throw new Error("User story not found");
    }

    return new UserStory(
      updated.id.toString(),
      updated.title,
      updated.description,
      updated.projectId.toString(),
      updated.createdBy.toString(),
      updated.priority,
      updated.status,
      updated.storyPoints,
      updated.capacity,
      updated.assignedTo?.toString(),
      updated.sprintId?.toString(),
      updated.createdAt,
      updated.updatedAt
    );
  }

  async findById(id: string): Promise<UserStory | null> {
    const doc = await UserStoryModel.findById(new Types.ObjectId(id)).exec();
    if (!doc) return null;

    return new UserStory(
      doc.id.toString(),
      doc.title,
      doc.description,
      doc.projectId.toString(),
      doc.createdBy.toString(),
      doc.priority,
      doc.status,
      doc.storyPoints,
      doc.capacity,
      doc.assignedTo?.toString(),
      doc.sprintId?.toString(),
      doc.createdAt,
      doc.updatedAt
    );
  }

  async findByProject(projectId: string): Promise<UserStory[]> {
    const docs = await UserStoryModel.find({
      projectId: new Types.ObjectId(projectId),
    }).exec();

    return docs.map(
      (doc) =>
        new UserStory(
          doc.id.toString(),
          doc.title,
          doc.description,
          doc.projectId.toString(),
          doc.createdBy.toString(),
          doc.priority,
          doc.status,
          doc.storyPoints,
          doc.capacity,
          doc.assignedTo?.toString(),
          doc.sprintId?.toString(),
          doc.createdAt,
          doc.updatedAt
        )
    );
  }

  async delete(id: string): Promise<void> {
    await UserStoryModel.findByIdAndDelete(new Types.ObjectId(id)).exec();
  }
}
