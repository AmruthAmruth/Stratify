import { UserStory } from "../entities/UserStory";

export interface IUserStoryRepository {
  create(userStory: UserStory): Promise<UserStory>;
  findById(id: string): Promise<UserStory | null>;
  findByProject(projectId: string): Promise<UserStory[]>;
  update(userStory: UserStory): Promise<UserStory>;
  delete(id: string): Promise<void>;
  findByNameAndBackLogId(name:string,backlogId:string):Promise<UserStory|null>
  findByBacklogId(backlogId:string):Promise<UserStory[]>
}
