import { ForecastAllocationResponseDTO } from "../../dto/forecast/ForecastAllocationResponseDTO";

export interface IGetForecastAllocationsByProjectUseCase {
    execute(projectId: string): Promise<ForecastAllocationResponseDTO[]>;
}
