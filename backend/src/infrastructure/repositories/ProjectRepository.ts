import { Project } from "../../domain/entities/Project";
import { IProjectRepository } from "../../domain/repositories/IProjectRepository";
import { ProjectModel, ProjectDocument } from "../models/ProjectModel"; // adjust path
import { Types } from "mongoose";

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
      createdByModel: "Manager", 
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
        updatedAt: new Date(),
      },
      { new: true }
    );

    if (!updated) throw new Error("Project not found");
    return this.mapToEntity(updated);
  }

  
  async delete(projectId: string): Promise<void> {
    const deleted = await ProjectModel.findByIdAndDelete(projectId);
    if (!deleted) throw new Error("Project not found");
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
    name: name,
    companyId: new Types.ObjectId(companyId)
  });

  return project ? this.mapToEntity(project) : null;
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
      doc.createdAt,
      doc.updatedAt
    );
  }
}
