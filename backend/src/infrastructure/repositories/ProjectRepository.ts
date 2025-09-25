import { Project } from "../../domain/entities/Project";
import { IProjectRepository } from "../../domain/repositories/IProjectRepository";
import { ProjectModel, ProjectDocument } from "../models/ProjectModel";
import { Types } from "mongoose";
import { AppError } from "../../interfaces/middleware/ErrorMiddleware";

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
      teamMemberIds: project.teamMemberIds?.map(id => new Types.ObjectId(id)),
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
    });

    return this.mapToEntity(created);
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
        teamMemberIds: project.teamMemberIds?.map(id => new Types.ObjectId(id)),
        updatedAt: new Date(), 
      },
      { new: true }
    );

    if (!updated) throw new AppError("Project not found", 404);
    return this.mapToEntity(updated);
  }

  async delete(projectId: string): Promise<void> {
    const deleted = await ProjectModel.findByIdAndDelete(projectId);
    if (!deleted) throw new AppError("Project not found", 404);
  }

  async findById(projectId: string): Promise<Project | null> {
    const project = await ProjectModel.findById(projectId);
    return project ? this.mapToEntity(project) : null;
  }

  async findAll(): Promise<Project[]> {
    const projects = await ProjectModel.find();
    return projects.map(this.mapToEntity);
  }

  async findByNameAndCompany(name: string, companyId: string): Promise<Project | null> {
    const project = await ProjectModel.findOne({
      companyId: new Types.ObjectId(companyId),
      normalizedName: name.toLowerCase().trim(),
    });

    return project ? this.mapToEntity(project) : null;
  }


  async findByKeyAndCompany(key: string, companyId: string): Promise<Project | null> {
    const project = await ProjectModel.findOne({
     companyId: new Types.ObjectId(companyId),
      key:key
    })
     return project ? this.mapToEntity(project) : null;
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
      endDate: 1
    }
  );

  return projects.map((doc) => ({
    id: doc.id.toString(),
    name: doc.name,
    description: doc.description,
    status: doc.status,
    startDate: doc.startDate,
    endDate: doc.endDate,
    projectLeadId: doc.projectLeadId?.toString()
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
      endDate: 1
    }
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


  private mapToEntity(doc: ProjectDocument): Project {
    return new Project(
      doc.id.toString(),
      doc.name,
      doc.key,
      doc.description,
      doc.startDate,
      doc.endDate,
      doc.status,
      doc.departmentId.toString(),
      doc.projectLeadId.toString(),
      doc.createdBy.toString(),
      doc.createdByModel,
      doc.companyId.toString(),
      doc.teamMemberIds?.map(id => id.toString()),
      doc.createdAt,
      doc.updatedAt
    );
  }
}
