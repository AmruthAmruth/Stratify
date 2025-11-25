
import { IGroupMessageRepository } from "../../../domain/repositories/IGroupMessageRepository";
import { IGetGroupMessagesUseCase } from "../../interfaces/chat/IGetGroupMessagesUseCase";


export class GetGroupMessagesUseCase implements IGetGroupMessagesUseCase{
    constructor(
            private _groupMessageRepo: IGroupMessageRepository
    ){}

    async execute(groupId: string, limit?: number, after?: Date): Promise<unknown> {
        return this._groupMessageRepo.getMessages(groupId, limit, after);
    }
}