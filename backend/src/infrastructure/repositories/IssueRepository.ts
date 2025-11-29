import mongoose from "mongoose";
import { Issue } from "../../domain/entities/Issue";
import { IIssueRepository } from "../../domain/repositories/IIssueRepository";
import { IssueMapper } from "../mappers/IssueMapper";
import { IssueModel } from "../models/IssueModel";

export class IssueRepository implements IIssueRepository {
  async create(issue: Issue): Promise<Issue> {
    const created = await IssueModel.create({
      heading: issue.heading,
      description: issue.description,
      acceptanceCriteria: issue.acceptanceCriteria,
      size: issue.size,
      type: issue.type,
      status: issue.status,
      priority: issue.priority,
      projectId: new mongoose.Types.ObjectId(issue.projectId),
      sprintId: issue.sprintId
        ? new mongoose.Types.ObjectId(issue.sprintId)
        : null,
      assignedTo: issue.assignedTo
        ? new mongoose.Types.ObjectId(issue.assignedTo)
        : null,
    });

    return IssueMapper.toEntity(created);
  }

  async update(issue: Issue): Promise<Issue> {
    const updated = await IssueModel.findByIdAndUpdate(
      issue.id,
      {
        heading: issue.heading,
        description: issue.description,
        acceptanceCriteria: issue.acceptanceCriteria,
        size: issue.size,
        type: issue.type,
        status: issue.status,
        priority: issue.priority,
        projectId: new mongoose.Types.ObjectId(issue.projectId),
        sprintId: issue.sprintId
          ? new mongoose.Types.ObjectId(issue.sprintId)
          : null,
        assignedTo: issue.assignedTo
          ? new mongoose.Types.ObjectId(issue.assignedTo)
          : null,
      },
      { new: true },
    );

    if (!updated) throw new Error("Issue not found");
    return IssueMapper.toEntity(updated);
  }

  async delete(id: string): Promise<void> {
    await IssueModel.findByIdAndDelete(id);
  }

  async findAllByProject(projectId: string): Promise<Issue[]> {
    const docs = await IssueModel.find({
      projectId: new mongoose.Types.ObjectId(projectId),
    });
    return IssueMapper.toEntities(docs);
  }

  async findById(id: string): Promise<Issue | null> {
    const doc = await IssueModel.findById(id);
    return doc ? IssueMapper.toEntity(doc) : null;
  }

  async findBySprintId(sprintId: string): Promise<Issue[]> {
    const docs = await IssueModel.find({
      sprintId: new mongoose.Types.ObjectId(sprintId),
    });
    return IssueMapper.toEntities(docs);
  }

  async findByProjectId(projectId: string): Promise<Issue[]> {
    const docs = await IssueModel.find({
      projectId: new mongoose.Types.ObjectId(projectId),
    });

    return IssueMapper.toEntities(docs);
  }




  async deleteByProjectId(projectId: string): Promise<void> {
    await IssueModel.deleteMany({
      projectId: new mongoose.Types.ObjectId(projectId),
    });
  }



  async findByUserId(userId: string): Promise<Issue[]> {
    const docs = await IssueModel.find({
      assignedTo: new mongoose.Types.ObjectId(userId),
    });

    return IssueMapper.toEntities(docs);
  }
}
