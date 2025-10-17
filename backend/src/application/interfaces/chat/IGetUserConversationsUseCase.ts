import { Conversation } from "../../../domain/entities/Conversation";

export interface IGetUserConversationsUseCase {
  execute(userId: string): Promise<Conversation[]>;
}
