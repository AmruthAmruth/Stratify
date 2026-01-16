import { ValidateEmployeeCapacityDTO, EmployeeCapacityValidationResult } from "../../dto/project/EmployeeCapacityValidationDTO";

export interface IValidateEmployeeCapacityUseCase {
    execute(dto: ValidateEmployeeCapacityDTO): Promise<EmployeeCapacityValidationResult>;
}
