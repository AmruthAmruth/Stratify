import { GetProjectsForEmployeeResponse } from "../../dto/project/GetProjectsForEmployeeDTO";

export interface IGetProjectsForEmployeeUseCase {
    execute(employeeId: string): Promise<GetProjectsForEmployeeResponse>;
}
