// infrastructure/repositories/IssueRepository.ts
import { Issue } from "../../domain/entities/Issue";
import { IIssueRepository } from "../../domain/repositories/IIssueRepository";
import { IssueMapper } from "../mappers/IssueMapper";
import { IssueModel } from "../models/IssueModel";

export class IssueRepository implements IIssueRepository {
  // Create a new issue
  async create(issue: Issue): Promise<Issue> {
    const created = await IssueModel.create({
      heading: issue.heading,
      description: issue.description,
      acceptanceCriteria: issue.acceptanceCriteria,
      size: issue.size,
      estimatedHours: issue.estimatedHours,
      type: issue.type,
      status: issue.status,
      priority: issue.priority,
      projectId: issue.projectId,
      sprintId: issue.sprintId || null,
      assignedTo: issue.assignedTo || null,
    });

    return IssueMapper.toEntity(created);
  }

  // Update an existing issue
  async update(issue: Issue): Promise<Issue> {
    const updated = await IssueModel.findByIdAndUpdate(
      issue.id,
      {
        heading: issue.heading,
        description: issue.description,
        acceptanceCriteria: issue.acceptanceCriteria,
        size: issue.size,
        estimatedHours: issue.estimatedHours,
        type: issue.type,
        status: issue.status,
        priority: issue.priority,
        projectId: issue.projectId,
        sprintId: issue.sprintId || null,
        assignedTo: issue.assignedTo || null,
      },
      { new: true } // return the updated document
    );

    if (!updated) throw new Error("Issue not found");
    return IssueMapper.toEntity(updated);
  }

  // Delete an issue
  async delete(id: string): Promise<void> {
    await IssueModel.findByIdAndDelete(id);
  }

  // Find all issues for a specific project
  async findAllByProject(projectId: string): Promise<Issue[]> {
    const docs = await IssueModel.find({ projectId });
    return IssueMapper.toEntities(docs);
  }

  // Find an issue by its ID
  async findById(id: string): Promise<Issue | null> {
    const doc = await IssueModel.findById(id);
    return doc ? IssueMapper.toEntity(doc) : null;
  }
}
