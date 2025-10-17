import { Message } from "../../../domain/entities/Message";

export interface ISendMessageUseCase {
  execute(
    data: Omit<Message, "id" | "createdAt" | "updatedAt">,
  ): Promise<Message>;
}
