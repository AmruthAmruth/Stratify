import { Issue } from "../entities/Issue";
import { EmployeeIssueDTO } from "../../application/dto/project/EmployeeIssueDTO";
export interface IIssueRepository {
  create(issue: Issue): Promise<Issue>;
  findById(id: string): Promise<Issue | null>;
  findAllByProject(projectId: string): Promise<Issue[]>;
  update(issue: Issue): Promise<Issue>;
  delete(id: string): Promise<void>;
  findBySprintId(sprintId: string): Promise<Issue[]>;
  findByProjectId(projectId: string): Promise<Issue[]>;
  deleteByProjectId(projectId: string): Promise<void>;
  findByUserId(userId: string): Promise<EmployeeIssueDTO[]>
}
