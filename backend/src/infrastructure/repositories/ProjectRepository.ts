import { Project } from "../../domain/entities/Project";
import { IProjectRepository } from "../../domain/repositories/IProjectRepository";
import { ProjectModel } from "../models/ProjectModel";
import mongoose from "mongoose";

export class ProjectRepository implements IProjectRepository {
  async create(project: Project): Promise<Project> {
    const created = await ProjectModel.create({
      _id: project.id ? new mongoose.Types.ObjectId(project.id) : undefined,
      name: project.name,
      description: project.description,
      companyId: project.companyId,
      createdBy: project.createdBy,
      managerId: project.managerId,
      status: project.status,
      startDate: project.startDate,
      endDate: project.endDate,
    });


    return new Project(
      created.id.toString(),
      created.name,
      created.description,
      created.companyId.toString(),
      created.createdBy.toString(),
      created.managerId?.toString(),
      created.status as any,
      created.startDate,
      created.endDate
    );
  }

  async update(project: Project): Promise<Project> {
    const updated = await ProjectModel.findByIdAndUpdate(
      project.id,
      {
        name: project.name,
        description: project.description,
        managerId: project.managerId,
        status: project.status,
        startDate: project.startDate,
        endDate: project.endDate,
      },
      { new: true }
    );

    if (!updated) throw new Error("Project not found");

    return new Project(
      updated.id.toString(),
      updated.name,
      updated.description,
      updated.companyId.toString(),
      updated.createdBy.toString(),
      updated.managerId?.toString(),
      updated.status as any,
      updated.startDate,
      updated.endDate
    );
  }

  async delete(projectId: string): Promise<void> {
    const result = await ProjectModel.findByIdAndDelete(projectId);
    if (!result) throw new Error("Project not found");
  }

  async findByCompany(companyId: string): Promise<Project[]> {
    const projects = await ProjectModel.find({ companyId });
    return projects.map(
      (p) =>
        new Project(
          p.id.toString(),
          p.name,
          p.description,
          p.companyId.toString(),
          p.createdBy.toString(),
          p.managerId?.toString(),
          p.status as any,
          p.startDate,
          p.endDate
        )
    );
  }

  async findById(projectId: string): Promise<Project | null> {
    const p = await ProjectModel.findById(projectId);
    if (!p) return null;

    return new Project(
      p.id.toString(),
      p.name,
      p.description,
      p.companyId.toString(),
      p.createdBy.toString(),
      p.managerId?.toString(),
      p.status as any,
      p.startDate,
      p.endDate
    );
  }
}
