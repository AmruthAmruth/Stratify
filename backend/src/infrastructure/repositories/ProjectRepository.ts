import { Project } from "../../domain/entities/Project";
import { IProjectRepository } from "../../domain/repositories/IProjectRepository";
import { ProjectModel } from "../models/ProjectModel";
import { Types } from "mongoose";
import { AppError } from "../../interfaces/middleware/ErrorMiddleware";
import { ProjectMapper } from "../mappers/ProjectMapper";

export class ProjectRepository implements IProjectRepository {
  async create(project: Project): Promise<Project> {
    const created = await ProjectModel.create({
      name: project.name,
      key: project.key,
      description: project.description,
      startDate: project.startDate,
      endDate: project.endDate,
      status: project.status,
      departmentId: new Types.ObjectId(project.departmentId),
      projectLeadId: new Types.ObjectId(project.projectLeadId),
      createdBy: new Types.ObjectId(project.createdBy),
      createdByModel: project.createdByModel,
      companyId: new Types.ObjectId(project.companyId),
      teamMemberIds: project.teamMemberIds?.map((id) => new Types.ObjectId(id)),
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
    });

    return ProjectMapper.toEntity(created);
  }

  async update(project: Project): Promise<Project> {
    const updated = await ProjectModel.findByIdAndUpdate(
      project.id,
      {
        name: project.name,
        key: project.key,
        description: project.description,
        startDate: project.startDate,
        endDate: project.endDate,
        status: project.status,
        departmentId: new Types.ObjectId(project.departmentId),
        projectLeadId: new Types.ObjectId(project.projectLeadId),
        teamMemberIds: project.teamMemberIds?.map(
          (id) => new Types.ObjectId(id),
        ),
        updatedAt: new Date(),
      },
      { new: true },
    );

    if (!updated) throw new AppError("Project not found", 404);
    return ProjectMapper.toEntity(updated);
  }

  async delete(projectId: string): Promise<void> {
    const deleted = await ProjectModel.findByIdAndDelete(projectId);
    if (!deleted) throw new AppError("Project not found", 404);
  }

  async findById(projectId: string): Promise<Project | null> {
    const project = await ProjectModel.findById(projectId);
    return project ? ProjectMapper.toEntity(project) : null;
  }

  async findAll(): Promise<Project[]> {
    const projects = await ProjectModel.find();
    return ProjectMapper.toEntities(projects);
  }

  async findByNameAndCompany(
    name?: string,
    companyId?: string,
  ): Promise<Project | null> {
    if (!name || !companyId) {
      throw new AppError("Project name or companyId is missing", 400);
    }

    const project = await ProjectModel.findOne({
      companyId: new Types.ObjectId(companyId),
      normalizedName: name.toLowerCase().trim(),
    });

    return project ? ProjectMapper.toEntity(project) : null;
  }

  async findByKeyAndCompany(
    key: string,
    companyId: string,
  ): Promise<Project | null> {
    const project = await ProjectModel.findOne({
      companyId: new Types.ObjectId(companyId),
      key: key,
    });
    return project ? ProjectMapper.toEntity(project) : null;
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
}
