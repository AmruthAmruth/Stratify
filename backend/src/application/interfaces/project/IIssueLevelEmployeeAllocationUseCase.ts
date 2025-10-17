import { ProjectLevelEmployeeAllocationDTO } from "../../dto/project/ProjectLavelEmployeeAllocationDTO";

export interface IIssueLevelEmployeeAllocation {
  execute(projectId: string): Promise<ProjectLevelEmployeeAllocationDTO>;
}
