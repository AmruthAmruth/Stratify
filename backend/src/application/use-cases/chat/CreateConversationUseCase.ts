import { Conversation } from "../../../domain/entities/Conversation";
import { IConversationRepository } from "../../../domain/repositories/IConversationRepository";
import { ICreateConversationUseCase } from "../../interfaces/chat/ICreateConversationUseCase";

export class CreateConversationUseCase implements ICreateConversationUseCase {
  constructor(private _conversationRepository: IConversationRepository) {}

  async execute(
    data: Omit<Conversation, "id" | "createdAt" | "updatedAt">
  ): Promise<Conversation> {
    const existingConversation = await this._conversationRepository.findByMembers(data.members);
    if (existingConversation) return existingConversation;

  
    return await this._conversationRepository.create(data);
  }
}
