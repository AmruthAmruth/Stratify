import { Issues } from "../../../domain/entities/Issues";
import { CreateIssuesDTO } from "../../dto/project/CreateIssuesDTO";


export interface ICreateIssueUseCase{
    execute(issue:CreateIssuesDTO):Promise<Issues>
}