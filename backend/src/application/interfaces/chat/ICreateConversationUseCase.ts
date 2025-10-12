import { Conversation } from "../../../domain/entities/Conversation";


export interface ICreateConversationUseCase{
    execute(data: Omit<Conversation, "id" | "createdAt" | "updatedAt">):Promise<Conversation>
}   