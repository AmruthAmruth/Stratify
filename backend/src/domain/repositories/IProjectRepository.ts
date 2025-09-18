import { Project } from "../entities/Project";

export interface IProjectRepository {

  create(project: Project): Promise<Project>;

 
  update(project: Project): Promise<Project>;


  findById(projectId: string): Promise<Project | null>;


  findByCompany(companyId: string): Promise<Project[]>;

  delete(projectId: string): Promise<void>;
}