import { Project } from "../../../domain/entities/Project";
import { CreateProjectDTO } from "../../dto/project/CreateProjectDTO";

export interface ICreateProjectUseCase {
  execute(projectDTO: CreateProjectDTO): Promise<Project>;
}
