import { Issue } from "../../../domain/entities/Issue";




export interface IAssignIssueToSprintUseCase{
    execute(issueId:string,sprintId:string):Promise<Issue>
}