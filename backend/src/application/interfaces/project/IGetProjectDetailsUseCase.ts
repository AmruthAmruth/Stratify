import { ProjectDetailsDTO } from "../../dto/project/GetProjectDetailsDTO";

export interface IGetProjectDetailsUseCase {
  execute(projectId: string): Promise<ProjectDetailsDTO>;
}
