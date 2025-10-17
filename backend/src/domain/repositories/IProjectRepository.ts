import { Project } from "../entities/Project";

export interface IProjectRepository {
  create(project: Project): Promise<Project>;
  update(project: Project): Promise<Project>;
  delete(projectId: string): Promise<void>;
  findById(projectId: string): Promise<Project | null>;
  findAll(): Promise<Project[]>;
  findByNameAndCompany(
    name: string,
    companyId: string,
  ): Promise<Project | null>;
  findByKeyAndCompany(key: string, companyId: string): Promise<Project | null>;
  findByCompanyId(companyId: string): Promise<Partial<Project>[]>;
  findByDepartmentId(departmentId: string): Promise<Partial<Project>[]>;
}
