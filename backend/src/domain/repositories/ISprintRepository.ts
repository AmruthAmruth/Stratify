import { Sprint } from "../entities/Sprint";

export interface ISprintRepository {
  create(sprint: Sprint): Promise<Sprint>;
  update(sprint: Sprint): Promise<Sprint>;
  findById(id: string): Promise<Sprint | null>;
  findByProject(projectId: string): Promise<Sprint[]>;
  delete(id: string): Promise<void>;
}