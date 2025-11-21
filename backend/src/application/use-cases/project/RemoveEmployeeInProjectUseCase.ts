import { IProjectRepository } from "../../../domain/repositories/IProjectRepository";
import { IRemoveEmployeeInProjectUseCase } from "../../interfaces/project/IRemoveEmployeeINProjectUseCase";

export class RemoveEmployeeInProjectUseCase implements IRemoveEmployeeInProjectUseCase {
    constructor(
        private _projectRepo: IProjectRepository,
    ) {}

    async execute(projectId: string, employeeId: string): Promise<void> {

        // 1. Get the project
        const project = await this._projectRepo.findById(projectId);
        if (!project) {
            throw new Error("Project not found");
        }

        // 2. Remove employee from teamMemberIds
        project.teamMemberIds = (project.teamMemberIds || []).filter(
            (id) => id !== employeeId
        );

        // 3. Save the updated project
        await this._projectRepo.update(project);
    }
}
