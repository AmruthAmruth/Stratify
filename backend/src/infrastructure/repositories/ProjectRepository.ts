import { Project } from "../../domain/entities/Project";
import { IProjectRepository } from "../../domain/repositories/IProjectRepository";
import { ProjectModel, ProjectDocument } from "../models/ProjectModel";
import { Types } from "mongoose";
import { AppError } from "../../interfaces/middleware/ErrorMiddleware";
import { StatusCodes } from "../../shared/constants/statusCodes";
import { Messages } from "../../shared/constants/messages";
import { ProjectMapper } from "../mappers/ProjectMapper";
import { BaseRepository } from "./BaseRepository";

export class ProjectRepository extends BaseRepository<Project, ProjectDocument> implements IProjectRepository {
  constructor() {
    super(ProjectModel, ProjectMapper);
  }

  async findByNameAndCompany(
    name?: string,
    companyId?: string,
  ): Promise<Project | null> {
    if (!name || !companyId) {
      throw new AppError(Messages.PROJECT_NAME_OR_COMPANY_ID_MISSING, StatusCodes.BAD_REQUEST);
    }

    return this.findOne({
      companyId: new Types.ObjectId(companyId),
      normalizedName: name.toLowerCase().trim(),
    });
  }

  async findByKeyAndCompany(
    key: string,
    companyId: string,
  ): Promise<Project | null> {
    return this.findOne({
      companyId: new Types.ObjectId(companyId),
      key: key,
    });
  }

  async findByCompanyId(companyId: string): Promise<Partial<Project>[]> {
    const projects = await ProjectModel.find(
      { companyId },
      {
        name: 1,
        description: 1,
        projectLeadId: 1,
        status: 1,
        startDate: 1,
        endDate: 1,
        departmentId: 1,
      },
    );

    return projects.map((doc) => ({
      id: doc.id.toString(),
      name: doc.name,
      description: doc.description,
      status: doc.status,
      startDate: doc.startDate,
      endDate: doc.endDate,
      departmentId: doc.departmentId?.toString(),
      projectLeadId: doc.projectLeadId?.toString(),
    }));
  }

  async findByDepartmentId(departmentId: string): Promise<Partial<Project>[]> {
    const projects = await ProjectModel.find(
      { departmentId },
      {
        name: 1,
        description: 1,
        status: 1,
        startDate: 1,
        endDate: 1,
      },
    );

    return projects.map((doc) => ({
      id: doc.id.toString(),
      name: doc.name,
      description: doc.description,
      status: doc.status,
      startDate: doc.startDate,
      endDate: doc.endDate,
    }));
  }

  async findByTeamMemberId(employeeId: string): Promise<Project[]> {
    return this.findMany({
      teamMemberIds: new Types.ObjectId(employeeId),
    });
  }

  async findActiveProjects(): Promise<Project[]> {
    const now = new Date();
    return this.findMany({
      startDate: { $lte: now },
      endDate: { $gte: now }
    });
  }
}
