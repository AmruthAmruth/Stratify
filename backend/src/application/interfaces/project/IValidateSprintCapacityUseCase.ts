import { SprintValidationDTO } from "../../dto/project/SprintValidationDTO";

export interface IValidateSprintCapacityUseCase {
    execute(sprintId: string): Promise<SprintValidationDTO>;
}
