

export interface IAddEmployeeProjectUseCase{
    execute(projectId:string,employeeId:string):Promise<void>
}