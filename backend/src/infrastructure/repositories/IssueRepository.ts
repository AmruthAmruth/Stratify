import mongoose from "mongoose";
import { Issue } from "../../domain/entities/Issue";
import { IIssueRepository } from "../../domain/repositories/IIssueRepository";
import { IssueMapper } from "../mappers/IssueMapper";
import { IssueModel } from "../models/IssueModel";
import { AppError } from "../../interfaces/middleware/ErrorMiddleware";
import { StatusCodes } from "../../shared/constants/statusCodes";
import { Messages } from "../../shared/constants/messages";
import { EmployeeIssueDTO } from "../../application/dto/project/EmployeeIssueDTO";

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

    if (!updated) throw new AppError(Messages.ISSUE_NOT_FOUND, StatusCodes.NOT_FOUND);
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



  async findByUserId(userId: string): Promise<EmployeeIssueDTO[]> {
    console.log(`[IssueRepository] findByUserId called with: ${userId}`);
    try {
      const objectId = new mongoose.Types.ObjectId(userId);
      console.log(`[IssueRepository] Converted to ObjectId: ${objectId}`);


      const results = await IssueModel.aggregate([
        {
          $match: { assignedTo: objectId }
        },
        {
          $lookup: {
            from: 'sprints',
            localField: 'sprintId',
            foreignField: '_id',
            as: 'sprint'
          }
        },
        {
          $match: {
            sprintId: { $ne: null },
            'sprint.status': 'Active'
          }
        },
        {
          $lookup: {
            from: 'projects',
            localField: 'projectId',
            foreignField: '_id',
            as: 'project'
          }
        },
        {
          $lookup: {
            from: 'subtasks',
            localField: '_id',
            foreignField: 'issueId',
            as: 'subtasks'
          }
        },
        {
          $addFields: {
            projectName: { $arrayElemAt: ['$project.name', 0] },
            estimatedHours: {
              $reduce: {
                input: '$subtasks',
                initialValue: 0,
                in: { $add: ['$$value', '$$this.hours'] }
              }
            },
            subTasks: {
              $map: {
                input: '$subtasks',
                as: 'st',
                in: {
                  id: { $toString: '$$st._id' },
                  title: '$$st.heading',
                  description: '$$st.description',
                  estimatedHours: '$$st.hours',
                  status: '$$st.status'
                }
              }
            }
          }
        },
        {
          $project: {
            project: 0,
            subtasks: 0,
            sprint: 0
          }
        }
      ]);

      console.log(`[IssueRepository] Found ${results.length} issues with project names and subtasks`);


      return results.map(doc => ({
        id: doc._id.toString(),
        heading: doc.heading,
        description: doc.description,
        acceptanceCriteria: doc.acceptanceCriteria,
        size: doc.size,
        estimatedHours: doc.estimatedHours || 0,
        type: doc.type,
        status: doc.status,
        priority: doc.priority,
        projectId: doc.projectId.toString(),
        projectName: doc.projectName || 'Unknown Project',
        sprintId: doc.sprintId ? doc.sprintId.toString() : null,
        assignedTo: doc.assignedTo ? doc.assignedTo.toString() : null,
        subTasks: doc.subTasks || [],
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt
      }));
    } catch (error) {
      console.error(`[IssueRepository] Error in findByUserId:`, error);
      throw error;
    }
  }



  async countPoints(employeeId: string, sprintId: string): Promise<number> {
    const issues = await IssueModel.find({ assignedTo: employeeId, sprintId })
    const totalPoint = issues.reduce((acc, cur) => cur.size + acc, 0);
    return totalPoint
  }



  async findBySprintAndAssignee(sprintId: string, assigneeId: string): Promise<Issue[]> {
    const docs = await IssueModel.find({
      sprintId: new mongoose.Types.ObjectId(sprintId),
      assignedTo: new mongoose.Types.ObjectId(assigneeId),
    });
    return IssueMapper.toEntities(docs);
  }
}
