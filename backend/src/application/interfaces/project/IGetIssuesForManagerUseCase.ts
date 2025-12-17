import { EmployeeIssueDTO } from "../../dto/project/EmployeeIssueDTO";

export interface IGetIssuesForManagerUseCase {
    execute(managerId: string): Promise<EmployeeIssueDTO[]>;
}
