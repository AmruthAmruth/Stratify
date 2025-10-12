import { Message } from "../../../domain/entities/Message";
import { IMessageRepository } from "../../../domain/repositories/IMessageRepository";
import { IGetMessageUseCase } from "../../interfaces/chat/IGetMessagesUseCase";



export class GetMessageUseCase implements IGetMessageUseCase{
    constructor(
      private _messageRepository: IMessageRepository
    ){};

   async execute(conversationId: string): Promise<Message[]> {
          return await this._messageRepository.findByConversation(conversationId);
    }
    
}