import { Issue } from "../../../domain/entities/Issue";


export interface IGetIssueForEmployeeUseCase{
    execute(employeeId:string):Promise<Issue[]>
}