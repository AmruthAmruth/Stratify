import { Issues } from "../entities/Issues";
export interface IIssueRepository {
  create(issue: Issues): Promise<Issues>;
  findById(id: string): Promise<Issues | null>;
  findAllByProject(projectId: string): Promise<Issues[]>;
  update(issue: Issues): Promise<Issues>;
  delete(id: string): Promise<void>;
}