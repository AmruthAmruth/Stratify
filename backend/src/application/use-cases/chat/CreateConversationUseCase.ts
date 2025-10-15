import { Conversation } from "../../../domain/entities/Conversation";
import { IConversationRepository } from "../../../domain/repositories/IConversationRepository";
import { ICreateConversationUseCase } from "../../interfaces/chat/ICreateConversationUseCase";

export class CreateConversationUseCase implements ICreateConversationUseCase {
  constructor(private _conversationRepository: IConversationRepository) {}

  async execute(
    data: Omit<Conversation, "id" | "createdAt" | "updatedAt">
  ): Promise<Conversation> {
    // Check if conversation already exists between the members
    const existingConversation = await this._conversationRepository.findByMembers(data.members);
    if (existingConversation) return existingConversation;

    // If not, create new conversation
    return await this._conversationRepository.create(data);
  }
}
