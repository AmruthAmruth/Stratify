import { IChatRepository } from "../../../domain/repositories/IChatRepository";
import { IGetUnreadCountsUseCase } from "../../interfaces/chat/IGetUnreadCountsUseCase";

export class GetUnreadCountsUseCase implements IGetUnreadCountsUseCase {
    constructor(private _chatRepository: IChatRepository) { }

    async execute(userId: string): Promise<Record<string, number>> {
        const unreadMap = await this._chatRepository.getUnreadCounts(userId);

        const unreadCounts: Record<string, number> = {};
        unreadMap.forEach((count, senderId) => {
            unreadCounts[senderId] = count;
        });

        return unreadCounts;
    }
}
