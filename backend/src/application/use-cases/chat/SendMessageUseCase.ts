import { Message } from "../../../domain/entities/Message";
import { IConversationRepository } from "../../../domain/repositories/IConversationRepository";
import { IMessageRepository } from "../../../domain/repositories/IMessageRepository";
import { ISendMessageUseCase } from "../../interfaces/chat/ISendMessageUseCase";

export class SendMessageUseCase implements ISendMessageUseCase {
  constructor(
    private _messageRepository: IMessageRepository,
    private _conversationRepository: IConversationRepository
  ) {}

  async execute(
    data: Omit<Message, "id" | "createdAt" | "updatedAt">,
    receiverId?: string
  ): Promise<Message> {
    let conversation = data.conversationId
      ? await this._conversationRepository.findById(data.conversationId)
      : null;

    // If conversation not found, use receiverId to find or create one
    if (!conversation) {
      if (!receiverId) throw new Error("receiverId is required to create a new conversation");

      conversation = await this._conversationRepository.findByMembers([data.senderId, receiverId]);

      if (!conversation) {
        conversation = await this._conversationRepository.create({
          members: [data.senderId, receiverId],
          isGroup: false,
          name: "",
        });
      }
    }

    if (!conversation.id) throw new Error("Conversation ID missing after creation");

    // Create the message and update conversation's lastMessage atomically
    const [message] = await Promise.all([
      this._messageRepository.create({
        conversationId: conversation.id,
        senderId: data.senderId,
        content: data.content,
        type: data.type,
      }),
      this._conversationRepository.updateLastMessage(conversation.id, data.content),
    ]);

    return message;
  }
}
