import { IIssueRepository } from "../../../domain/repositories/IIssueRepository";
import { IGetIssueForEmployeeUseCase } from "../../interfaces/project/IGetIssueForEmployeeUseCase";
import { EmployeeIssueDTO } from "../../dto/project/EmployeeIssueDTO";

export class GetIssueForEmployeeUseCase implements IGetIssueForEmployeeUseCase {
  constructor(private IssueRepo: IIssueRepository) { }

  async execute(employeeId: string): Promise<EmployeeIssueDTO[]> {
    const issues = await this.IssueRepo.findByUserId(employeeId);
    if (!issues || issues.length === 0) {
      return [];
    }
    return issues;
  }
}
