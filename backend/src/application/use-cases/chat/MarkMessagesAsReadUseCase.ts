import { IChatRepository } from "../../../domain/repositories/IChatRepository";
import { IMarkMessagesAsReadUseCase } from "../../interfaces/chat/IMarkMessagesAsReadUseCase";

export class MarkMessagesAsReadUseCase implements IMarkMessagesAsReadUseCase {
    constructor(private _chatRepository: IChatRepository) { }

    async execute(userId: string, senderId: string): Promise<void> {
        await this._chatRepository.markMessagesAsRead(userId, senderId);
    }
}
