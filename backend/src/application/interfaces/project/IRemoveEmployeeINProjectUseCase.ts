export interface IRemoveEmployeeInProjectUseCase{
    execute(projectId:string,employeeId:string):Promise<void>
}