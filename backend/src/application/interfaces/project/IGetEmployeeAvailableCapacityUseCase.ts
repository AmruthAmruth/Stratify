import { EmployeeAvailableCapacityDTO } from "../../dto/project/EmployeeAvailableCapacityDTO";

export interface IGetEmployeeAvailableCapacityUseCase {
    execute(employeeId: string, sprintId: string): Promise<EmployeeAvailableCapacityDTO>;
}
