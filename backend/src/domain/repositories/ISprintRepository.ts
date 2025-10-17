import { Sprint } from "../entities/Sprint";

export interface ISprintRepository {
  create(sprint: Sprint): Promise<Sprint>;
  update(sprint: Sprint): Promise<Sprint>;
  findById(id: string): Promise<Sprint | null>;
  findByProject(projectId: string): Promise<Sprint[]>;
  delete(id: string): Promise<void>;
  findOverlappingSprint(
    projectId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<Sprint | null>;
  findByProjectId(projectId: string): Promise<Sprint[]>;
  deleteByProjectId(projectId: string): Promise<void>;
}
