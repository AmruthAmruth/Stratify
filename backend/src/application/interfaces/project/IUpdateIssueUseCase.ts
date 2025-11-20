import { Issue } from "../../../domain/entities/Issue";
import { UpdateIssueDTO } from "../../dto/project/CreateIssuesDTO";



export interface IUpdateIssueUseCase {
    execute(issueDTO:UpdateIssueDTO):Promise<Issue>
}