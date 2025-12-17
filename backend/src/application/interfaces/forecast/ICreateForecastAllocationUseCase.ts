import { CreateForecastAllocationDTO } from "../../dto/forecast/CreateForecastAllocationDTO";
import { ForecastAllocationResponseDTO } from "../../dto/forecast/ForecastAllocationResponseDTO";

export interface ICreateForecastAllocationUseCase {
    execute(
        data: CreateForecastAllocationDTO,
        createdBy: string,
        createdByModel: "Company" | "Manager",
        companyId: string,
    ): Promise<ForecastAllocationResponseDTO>;
}
