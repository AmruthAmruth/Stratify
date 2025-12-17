import { ForecastVsActualDTO } from "../../dto/forecast/ForecastVsActualDTO";

export interface ICalculateForecastVsActualUseCase {
    execute(
        employeeId: string,
        projectId: string,
        startDate?: string,
        endDate?: string,
    ): Promise<ForecastVsActualDTO>;
}
