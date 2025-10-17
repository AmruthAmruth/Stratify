import { Backlog } from "../entities/Backlog";

export interface IBacklogRepository {
  findById(id: string): Promise<Backlog | null>;

  findByProjectId(projectId: string): Promise<Backlog[]>;

  create(backlog: Backlog): Promise<Backlog>;

  update(backlog: Backlog): Promise<Backlog>;

  delete(id: string): Promise<void>;

  findByNameAndProject(
    name: string,
    projectId: string,
  ): Promise<Backlog | null>;
}
