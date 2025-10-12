import { Message } from "../../../domain/entities/Message";
import { ISendMessageUseCase } from "../../interfaces/chat/ISendMessageUseCase";



export class SendMessageUseCase implements ISendMessageUseCase{
    constructor(

    ){}

    async execute(data: Omit<Message, "id" | "createdAt" | "updatedAt">): Promise<Message> {
        
    }
}