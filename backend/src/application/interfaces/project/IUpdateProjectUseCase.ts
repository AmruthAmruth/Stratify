import { Project } from "../../../domain/entities/Project";
import { UpdateProjectDTO } from "../../dto/project/CreateProjectDTO";

export interface IUpdateProjectUseCase {
  execute(projectDTO: UpdateProjectDTO): Promise<Project>;
}
