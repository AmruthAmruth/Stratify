import { Types } from "mongoose";
import { UserStory } from "../../domain/entities/UserStory";
import { IUserStoryRepository } from "../../domain/repositories/IUserStoryRepository";
import { UserStoryModel } from "../models/UserStoryModel";
import { UserStoryMapper } from "../mappers/UserStoryMapper";

export class UserStoryRepository implements IUserStoryRepository {

  async create(userStory: UserStory): Promise<UserStory> {
    const doc = new UserStoryModel(UserStoryMapper.toDocument(userStory));
    const created = await doc.save();
    return UserStoryMapper.toEntity(created);
  }

  async update(userStory: UserStory): Promise<UserStory> {
    const updated = await UserStoryModel.findByIdAndUpdate(
      new Types.ObjectId(userStory.id),
      UserStoryMapper.toDocument(userStory),
      { new: true }
    ).exec();

    if (!updated) throw new Error("User story not found");

    return UserStoryMapper.toEntity(updated);
  }

  async findById(id: string): Promise<UserStory | null> {
    const doc = await UserStoryModel.findById(new Types.ObjectId(id)).exec();
    return doc ? UserStoryMapper.toEntity(doc) : null;
  }

  async findByProject(projectId: string): Promise<UserStory[]> {
    const docs = await UserStoryModel.find({ projectId: new Types.ObjectId(projectId) }).exec();
    return docs.map(UserStoryMapper.toEntity);
  }

  async delete(id: string): Promise<void> {
    await UserStoryModel.findByIdAndDelete(new Types.ObjectId(id)).exec();
  }

  async findByNameAndBackLogId(name: string, backlogId: string): Promise<UserStory | null> {
    const doc = await UserStoryModel.findOne({ title: name, backlogId }).exec();
    return doc ? UserStoryMapper.toEntity(doc) : null;
  }

  async findByBacklogId(backlogId: string): Promise<UserStory[]> {
    const docs = await UserStoryModel.find({ backlogId: new Types.ObjectId(backlogId) }).exec();
    return docs.map(UserStoryMapper.toEntity);
  }

  async findBySprintId(sprintId: string): Promise<UserStory[]> {
    const docs = await UserStoryModel.find({ sprintId: new Types.ObjectId(sprintId) }).exec();
    return docs.map(UserStoryMapper.toEntity);
  }

  async findByIds(userStoryIds: string[]): Promise<UserStory[]> {
    const objectIds = userStoryIds.map(id => new Types.ObjectId(id));
    const docs = await UserStoryModel.find({ _id: { $in: objectIds } }).exec();
    return docs.map(UserStoryMapper.toEntity);
  }

  async updateUserStories(userStories: UserStory[]): Promise<UserStory[]> {
    const updatedStories: UserStory[] = [];

    for (const story of userStories) {
      const updated = await UserStoryModel.findByIdAndUpdate(
        new Types.ObjectId(story.id),
        UserStoryMapper.toDocument(story),
        { new: true }
      ).exec();

      if (!updated) throw new Error(`User story not found with id: ${story.id}`);

      updatedStories.push(UserStoryMapper.toEntity(updated));
    }

    return updatedStories;
  }
}
