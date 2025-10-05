import { Issues } from "../../../domain/entities/Issues";
import { IProjectRepository } from "../../../domain/repositories/IProjectRepository";
import { CreateIssuesDTO } from "../../dto/project/CreateIssuesDTO";
import { ICreateIssueUseCase } from "../../interfaces/project/ICreateIssueUseCase";



export class CreateIssueUseCase implements ICreateIssueUseCase{
    constructor(
            private _projectRepo:IProjectRepository,
            
    ){};

    async execute(issue: CreateIssuesDTO): Promise<Issues> {
      
    }
}