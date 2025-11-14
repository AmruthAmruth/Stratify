
import { IProjectRepository } from "../../../domain/repositories/IProjectRepository";
import { IRemoveEmployeeInProjectUseCase } from "../../interfaces/project/IRemoveEmployeeINProjectUseCase";



export class RemoveEmployeeInProjectUseCase implements IRemoveEmployeeInProjectUseCase{
    constructor(
                private _projectRepo:IProjectRepository,
    ){}

    async execute(projectId: string, employeeId: string): Promise<void> {
           
        const project = await this._projectRepo.findById(projectId)

            project?.teamMemberIds?.filter((empId)=>empId !== employeeId)

           await this._projectRepo.update(project!)
    }
}