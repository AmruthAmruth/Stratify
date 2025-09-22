import { Project } from "../entities/Project";



export interface IProjectRepository{
   create(project: Project): Promise<Project>;
  findById(id: string): Promise<Project | null>;
  findAll(filter?: {
    departmentId?: string;
    projectLeadId?: string;
    status?: string;
  }): Promise<Project[]>;
  update(project: Project): Promise<void>;
  delete(id: string): Promise<void>;
  count(filter?: {
    departmentId?: string;
    status?: string;
  }): Promise<number>;
}