import { EmployeeIssueDTO } from "../../dto/project/EmployeeIssueDTO";

export interface IGetIssueForEmployeeUseCase {
    execute(employeeId: string): Promise<EmployeeIssueDTO[]>
}