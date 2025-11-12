import { Chat } from "../../../domain/entities/Chat";

export interface IGetChatUseCase {
  execute(user1Id: string, user2Id: string): Promise<Chat[]>;
}