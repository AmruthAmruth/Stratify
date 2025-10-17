import { Issue } from "../../../domain/entities/Issue";
import { CreateIssuesDTO } from "../../dto/project/CreateIssuesDTO";

export interface ICreateIssueUseCase {
  execute(issue: CreateIssuesDTO): Promise<Issue>;
}
