

export interface IDeleteIssueUseCase{
    execute(issueId:string):Promise<void>
}