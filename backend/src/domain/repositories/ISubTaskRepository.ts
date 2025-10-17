import { SubTask } from "../entities/SubTask";

export interface ISubtaskRepository {
  create(issue: SubTask): Promise<SubTask>;
  findById(id: string): Promise<SubTask | null>;
  findAllByIssue(issueId: string): Promise<SubTask[]>;
  update(issue: SubTask): Promise<SubTask>;
  delete(id: string): Promise<void>;
  findByProjectId(projectId: string): Promise<SubTask[]>;
  deleteByIssueId(issueId: string): Promise<void>;
}
