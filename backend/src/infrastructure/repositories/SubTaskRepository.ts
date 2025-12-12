import mongoose from "mongoose";
import { SubTask } from "../../domain/entities/SubTask";
import { ISubtaskRepository } from "../../domain/repositories/ISubTaskRepository";
import { SubTaskModel } from "../models/SubTaskModel";
import { SubTaskMapper } from "../mappers/SubTaskMapper";
import { AppError } from "../../interfaces/middleware/ErrorMiddleware";
import { StatusCodes } from "../../shared/constants/statusCodes";
import { Messages } from "../../shared/constants/messages";

export class SubTaskRepository implements ISubtaskRepository {
  async create(subtask: SubTask): Promise<SubTask> {
    const created = await SubTaskModel.create({
      issueId: new mongoose.Types.ObjectId(subtask.issueId),
      heading: subtask.heading,
      description: subtask.description,
      hours: subtask.hours,
      status: subtask.status,
      assignedToId: subtask.assignedToId || null,
    });

    return SubTaskMapper.toEntity(created);
  }





  async findAllByIssue(issueId: string): Promise<SubTask[]> {
    const docs = await SubTaskModel.find({ issueId: new mongoose.Types.ObjectId(issueId) });
    return SubTaskMapper.toEntities(docs);
  }

  async findById(id: string): Promise<SubTask | null> {
    const doc = await SubTaskModel.findById(id);
    return doc ? SubTaskMapper.toEntity(doc) : null;
  }

  async update(subtask: SubTask): Promise<SubTask> {
    const updated = await SubTaskModel.findByIdAndUpdate(
      subtask.id,
      {
        heading: subtask.heading,
        description: subtask.description,
        hours: subtask.hours,
        status: subtask.status,
        assignedToId: subtask.assignedToId || null,
        updatedAt: new Date(),
      },
      { new: true },
    );

    if (!updated) throw new AppError(Messages.SUBTASK_NOT_FOUND, StatusCodes.NOT_FOUND);
    return SubTaskMapper.toEntity(updated);
  }

  async delete(id: string): Promise<void> {
    await SubTaskModel.findByIdAndDelete(id);
  }

  async findByProjectId(projectId: string): Promise<SubTask[]> {
    const docs = await SubTaskModel.find()
      .populate({
        path: "issueId",
        match: { projectId },
        select: "_id projectId",
      })
      .exec();

    const filteredDocs = docs.filter((doc) => doc.issueId !== null);

    return SubTaskMapper.toEntities(filteredDocs);
  }

  async deleteByIssueId(issueId: string): Promise<void> {
    await SubTaskModel.deleteMany({ issueId });
  }





}
