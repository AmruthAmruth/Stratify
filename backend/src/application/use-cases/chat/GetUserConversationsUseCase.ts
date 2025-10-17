import { Conversation } from "../../../domain/entities/Conversation";
import { IConversationRepository } from "../../../domain/repositories/IConversationRepository";
import { IGetUserConversationsUseCase } from "../../interfaces/chat/IGetUserConversationsUseCase";

export class GetUserConversationUseCase
  implements IGetUserConversationsUseCase
{
  constructor(private _conversationRepository: IConversationRepository) {}

  async execute(userId: string): Promise<Conversation[]> {
    return await this._conversationRepository.findUserConversations(userId);
  }
}
