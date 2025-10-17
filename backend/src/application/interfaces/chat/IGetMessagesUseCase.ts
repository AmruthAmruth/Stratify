import { Message } from "../../../domain/entities/Message";

export interface IGetMessageUseCase {
  execute(conversationId: string): Promise<Message[]>;
}
