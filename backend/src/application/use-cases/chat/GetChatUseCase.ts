import { Chat } from "../../../domain/entities/Chat";
import { IChatRepository } from "../../../domain/repositories/IChatRepository";
import { IGetChatUseCase } from "../../interfaces/chat/IGetChatUseCase";


export class GetChatUseCase implements IGetChatUseCase{
    constructor(
        private _chatRepo:IChatRepository
    ){}

    async execute(user1Id: string, user2Id: string): Promise<Chat[]> {
        console.log(user1Id,"---", user2Id);
        
        const chats = await this._chatRepo.getConversation(user1Id, user2Id);

         return chats.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
    }
}