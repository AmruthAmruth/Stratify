import { ProjectLevelEmployeeAllocationDTO } from "../../dto/project/ProjectLavelEmployeeAllocationDTO";

export interface IProjectLevelEmployeeAllocationUseCase {
  execute(managerId: string): Promise<ProjectLevelEmployeeAllocationDTO[]>;
}
