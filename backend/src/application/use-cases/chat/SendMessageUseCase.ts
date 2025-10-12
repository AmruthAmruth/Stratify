import { Message } from "../../../domain/entities/Message";
import { IConversationRepository } from "../../../domain/repositories/IConversationRepository";
import { IMessageRepository } from "../../../domain/repositories/IMessageRepository";
import { AppError } from "../../../interfaces/middleware/ErrorMiddleware";
import { ISendMessageUseCase } from "../../interfaces/chat/ISendMessageUseCase";

export class SendMessageUseCase implements ISendMessageUseCase {
  constructor(
    private _messageRepository: IMessageRepository,
    private _conversationRepository: IConversationRepository
  ) {}

  async execute(
    data: Omit<Message, "id" | "createdAt" | "updatedAt">
  ): Promise<Message> {
    const conversation = await this._conversationRepository.findById(
      data.conversationId
    );
    if (!conversation) throw new AppError("Conversation not found", 404);
    const message = await this._messageRepository.create(data);
    await this._conversationRepository.updateLastMessage(
      data.conversationId,
      data.content
    );
    return message;
  }
}
