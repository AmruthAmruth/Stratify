import { SprintCapacityDTO } from "../../dto/project/SprintCapacityDTO";

export interface ICalculateSprintCapacityUseCase {
    execute(sprintId: string): Promise<SprintCapacityDTO>;
}
