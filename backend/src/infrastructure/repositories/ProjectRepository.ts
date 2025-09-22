import { Project } from "../../domain/entities/Project";
import { IProjectRepository } from "../../domain/repositories/IProjectRepository";
import { ProjectDocument, ProjectModel } from "../models/ProjectModel";

export class ProjectRepository implements IProjectRepository {

  private mapToDomain(projectDoc: ProjectDocument): Project {
    return new Project(
      projectDoc.id.toString(),
      projectDoc.name,
      projectDoc.key,
      projectDoc.description,
      projectDoc.startDate || new Date(),
      projectDoc.endDate || new Date(),
      projectDoc.status,
      projectDoc.departmentId.toString(),
      projectDoc.projectLeadId.toString(),
      projectDoc.assignedEmployeeIds.map(id => id.toString()),
      projectDoc.backlogIds.map(id => id.toString()),
      projectDoc.sprintIds.map(id => id.toString()),
      projectDoc.createdAt,
      projectDoc.updatedAt
    );
  }

  async create(project: Project): Promise<Project> {
    const created = await ProjectModel.create({
      name: project.name,
      key: project.key,
      description: project.description,
      companyId: project.departmentId, 
      departmentId: project.departmentId,
      createdBy: project.projectLeadId,
      createdByModel: "Manager", 
      projectLeadId: project.projectLeadId,
      assignedEmployeeIds: project.assignedEmployeeIds,
      backlogIds: project.backlogIds,
      sprintIds: project.sprintIds,
      status: project.status,
      startDate: project.startDate,
      endDate: project.endDate,
    });

    return this.mapToDomain(created);
  }

  async update(project: Project): Promise<void> {
    await ProjectModel.findByIdAndUpdate(project.id, {
      name: project.name,
      key: project.key,
      description: project.description,
      status: project.status,
      startDate: project.startDate,
      endDate: project.endDate,
      projectLeadId: project.projectLeadId,
      assignedEmployeeIds: project.assignedEmployeeIds,
      backlogIds: project.backlogIds,
      sprintIds: project.sprintIds,
    }, { new: true });
  }

  async delete(id: string): Promise<void> {
    await ProjectModel.findByIdAndDelete(id);
  }

  async findById(id: string): Promise<Project | null> {
    const projectDoc = await ProjectModel.findById(id);
    if (!projectDoc) return null;
    return this.mapToDomain(projectDoc);
  }

  async findAll(filter?: { departmentId?: string; projectLeadId?: string; status?: string; }): Promise<Project[]> {
    const query: any = {};
    if (filter?.departmentId) query.departmentId = filter.departmentId;
    if (filter?.projectLeadId) query.projectLeadId = filter.projectLeadId;
    if (filter?.status) query.status = filter.status;

    const projectDocs = await ProjectModel.find(query);
    return projectDocs.map(this.mapToDomain);
  }

  async count(filter?: { departmentId?: string; status?: string; }): Promise<number> {
    const query: any = {};
    if (filter?.departmentId) query.departmentId = filter.departmentId;
    if (filter?.status) query.status = filter.status;

    return ProjectModel.countDocuments(query);
  }
}
