import { Chat } from "../../../domain/entities/Chat";
import { IChatRepository } from "../../../domain/repositories/IChatRepository";
import { ISaveChatUseCase } from "../../interfaces/chat/ISaveChatUseCase";




export class SaveChatUseCase implements ISaveChatUseCase{
    constructor(
    private _chatRepo:IChatRepository
    ){}

    async execute(senderId: string, receiverId: string, message: string): Promise<Chat> {
           const chat = new Chat(
      crypto.randomUUID(),
      senderId,
      receiverId,
      message,
      new Date()
    );
    return this._chatRepo.save(chat);
    }
}