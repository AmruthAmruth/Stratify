import { Issue } from "../../../domain/entities/Issue";
import { IIssueRepository } from "../../../domain/repositories/IIssueRepository";
import { IGetIssueForEmployeeUseCase } from "../../interfaces/project/IGetIssueForEmployeeUseCase";

export class GetIssueForEmployeeUseCase implements IGetIssueForEmployeeUseCase {
  constructor(private IssueRepo: IIssueRepository) {}

  async execute(employeeId: string): Promise<Issue[]> {
    const issues = await this.IssueRepo.findByUserId(employeeId);
    if (!issues || issues.length === 0) {
      return [];
    }
    return issues;
  }
}
