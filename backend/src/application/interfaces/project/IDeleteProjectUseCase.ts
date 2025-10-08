

export interface IDeleteProjectUseCase{
    execute(projectId:string):Promise<void>
}