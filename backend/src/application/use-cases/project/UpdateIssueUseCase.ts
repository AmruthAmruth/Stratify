import { Issue } from "../../../domain/entities/Issue";
import { IIssueRepository } from "../../../domain/repositories/IIssueRepository";
import { AppError } from "../../../interfaces/middleware/ErrorMiddleware";
import { UpdateIssueDTO } from "../../dto/project/CreateIssuesDTO";
import { IUpdateIssueUseCase } from "../../interfaces/project/IUpdateIssueUseCase";

export class UpdateIssueUseCase implements IUpdateIssueUseCase {
  constructor(private _issueRepo: IIssueRepository) { }

  async execute(issueDTO: UpdateIssueDTO): Promise<Issue> {


    const existingIssue = await this._issueRepo.findById(issueDTO.id);
    if (!existingIssue) {
      throw new AppError("Issue not found", 404);
    }


    const updatedIssue = new Issue(
      existingIssue.id,
      issueDTO.heading ?? existingIssue.heading,
      issueDTO.description ?? existingIssue.description,
      issueDTO.acceptanceCriteria ?? existingIssue.acceptanceCriteria,
      issueDTO.size ?? existingIssue.size,
      issueDTO.type ?? existingIssue.type,
      existingIssue.status,
      issueDTO.priority ?? existingIssue.priority,
      existingIssue.projectId,
      existingIssue.sprintId,
      issueDTO.assignedTo !== undefined ? issueDTO.assignedTo : existingIssue.assignedTo,
      existingIssue.createdAt,
      new Date(),
    );

    const savedIssue = await this._issueRepo.update(updatedIssue);



    return savedIssue;
  }
}
