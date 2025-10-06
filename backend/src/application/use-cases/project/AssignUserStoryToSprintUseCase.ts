// import { Sprint } from "../../../domain/entities/Sprint";
// import { ISprintRepository } from "../../../domain/repositories/ISprintRepository";
// import { IUserStoryRepository } from "../../../domain/repositories/IUserStoryRepository";
// import { AppError } from "../../../interfaces/middleware/ErrorMiddleware";
// import { AssignUserStoryToSprintDTO } from "../../dto/project/AssignUserStoryToSprintDTO";
// import { IAssignUserStoryToSprintUseCase } from "../../interfaces/project/IAssignUserStoryToSprintUseCase";

// export class AssignUserStoryToSprintUseCase
//   implements IAssignUserStoryToSprintUseCase
// {
//   constructor(
//     private _sprintRepo: ISprintRepository,
//     private _userStoryRepo: IUserStoryRepository
//   ) {}

//   async execute(dto: AssignUserStoryToSprintDTO): Promise<Sprint> {
//     const sprint = await this._sprintRepo.findById(dto.sprintId);
//     if (!sprint) {
//       throw new AppError(`Sprint not found with id: ${dto.sprintId}`);
//     }

//     const userStories = await this._userStoryRepo.findByIds(dto.userStoryIds);

//     if (userStories.length !== dto.userStoryIds.length) {
//       throw new AppError("One or more user stories not found");
//     }

//     const updatedStories = userStories.map((story) => {
//       story.sprintId = sprint.id!;
//       return story;
//     });

//     const storyIdsToAdd = userStories
//       .map((story) => story.id!)
//       .filter((id) => !sprint.userStoryIds.includes(id));

//     sprint.userStoryIds = [...sprint.userStoryIds, ...storyIdsToAdd];

//     await this._userStoryRepo.updateUserStories(updatedStories);
//     const updatedSprint = await this._sprintRepo.update(sprint);

//     return updatedSprint;
//   }
// }
