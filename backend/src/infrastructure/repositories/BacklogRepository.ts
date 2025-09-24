import { Types } from "mongoose";
import { Backlog } from "../../domain/entities/Backlog";
import { IBacklogRepository } from "../../domain/repositories/IBacklogRepository";
import { BacklogModel } from "../models/BacklogModel";

export class BacklogRepository implements IBacklogRepository {
  async create(backlog: Backlog): Promise<Backlog> {
    const created = await new BacklogModel({
      projectId: new Types.ObjectId(backlog.projectId),
      name: backlog.name,
      description: backlog.description,
      createdBy: new Types.ObjectId(backlog.createdBy),
    }).save();

    return new Backlog(
      created.id.toString(),
      created.projectId.toString(),
      created.name,
      created.description,
      created.createdBy.toString(),
      created.createdAt,
      created.updatedAt
    );
  }

  async update(backlog: Backlog): Promise<Backlog> {
    const updated = await BacklogModel.findByIdAndUpdate(
      new Types.ObjectId(backlog.id),
      {
        name: backlog.name,
        description: backlog.description,
      },
      { new: true }
    ).exec();

    if (!updated) throw new Error("Backlog not found");

    return new Backlog(
      updated.id.toString(),
      updated.projectId.toString(),
      updated.name,
      updated.description,
      updated.createdBy.toString(),
      updated.createdAt,
      updated.updatedAt
    );
  }

  async findById(id: string): Promise<Backlog | null> {
    const doc = await BacklogModel.findById(new Types.ObjectId(id)).exec();
    if (!doc) return null;

    return new Backlog(
      doc.id.toString(),
      doc.projectId.toString(),
      doc.name,
      doc.description,
      doc.createdBy.toString(),
      doc.createdAt,
      doc.updatedAt
    );
  }

  async findByProjectId(projectId: string): Promise<Backlog[]> {
    const docs = await BacklogModel.find({
      projectId: new Types.ObjectId(projectId),
    }).exec();

    return docs.map(
      (doc) =>
        new Backlog(
          doc.id.toString(),
          doc.projectId.toString(),
          doc.name,
          doc.description,
          doc.createdBy.toString(),
          doc.createdAt,
          doc.updatedAt
        )
    );
  }

  async delete(id: string): Promise<void> {
    await BacklogModel.findByIdAndDelete(new Types.ObjectId(id)).exec();
  }
}
