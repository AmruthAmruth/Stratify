import { Types } from "mongoose";
import { Backlog } from "../../domain/entities/Backlog";
import { IBacklogRepository } from "../../domain/repositories/IBacklogRepository";
import { BacklogModel } from "../models/BacklogModel";
import { BacklogMapper } from "../mappers/BacklogMapper";
import { AppError } from "../../interfaces/middleware/ErrorMiddleware";
import { StatusCodes } from "../../shared/constants/statusCodes";
import { Messages } from "../../shared/constants/messages";

export class BacklogRepository implements IBacklogRepository {
  async create(backlog: Backlog): Promise<Backlog> {
    const created = await new BacklogModel({
      projectId: new Types.ObjectId(backlog.projectId),
      name: backlog.name,
      description: backlog.description,
      createdBy: new Types.ObjectId(backlog.createdBy),
    }).save();

    return BacklogMapper.toEntity(created);
  }

  async update(backlog: Backlog): Promise<Backlog> {
    const updated = await BacklogModel.findByIdAndUpdate(
      new Types.ObjectId(backlog.id),
      {
        name: backlog.name,
        description: backlog.description,
      },
      { new: true },
    ).exec();

    if (!updated) throw new AppError(Messages.BACKLOG_NOT_FOUND, StatusCodes.NOT_FOUND);

    return BacklogMapper.toEntity(updated);
  }

  async findById(id: string): Promise<Backlog | null> {
    const doc = await BacklogModel.findById(new Types.ObjectId(id)).exec();
    if (!doc) return null;

    return BacklogMapper.toEntity(doc);
  }

  async findByProjectId(projectId: string): Promise<Backlog[]> {
    const docs = await BacklogModel.find({
      projectId: new Types.ObjectId(projectId),
    }).exec();

    return BacklogMapper.toEntities(docs);
  }

  async delete(id: string): Promise<void> {
    await BacklogModel.findByIdAndDelete(new Types.ObjectId(id)).exec();
  }

  async findByNameAndProject(
    name: string,
    projectId: string,
  ): Promise<Backlog | null> {
    const doc = await BacklogModel.findOne({
      name,
      projectId: new Types.ObjectId(projectId),
    }).exec();

    if (!doc) return null;
    return BacklogMapper.toEntity(doc);
  }
}
