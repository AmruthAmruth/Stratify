import { UpdateForecastAllocationDTO } from "../../dto/forecast/UpdateForecastAllocationDTO";
import { ForecastAllocationResponseDTO } from "../../dto/forecast/ForecastAllocationResponseDTO";

export interface IUpdateForecastAllocationUseCase {
    execute(
        id: string,
        data: UpdateForecastAllocationDTO,
    ): Promise<ForecastAllocationResponseDTO>;
}
