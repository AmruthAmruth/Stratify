import { IIssueRepository } from "../../../domain/repositories/IIssueRepository";
import { AppError } from "../../../interfaces/middleware/ErrorMiddleware";
import { IDeleteIssueUseCase } from "../../interfaces/project/IDeleteIssueUseCase";

export class DeleteIssueUseCase implements IDeleteIssueUseCase {
  constructor(private _issueRepo: IIssueRepository) {}

  async execute(issueId: string): Promise<void> {
    console.log(issueId);
    
    const issue = await this._issueRepo.findById(issueId);
    if (!issue) {
      throw new AppError("Issue Not found");
    }

    await this._issueRepo.delete(issueId);
  }
}
