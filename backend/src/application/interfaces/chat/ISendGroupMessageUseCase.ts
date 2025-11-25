import { GroupMessage } from "../../../domain/entities/GroupMessage";

export interface ISendGroupMessageUseCase{
    execute(groupId: string, senderId: string, message: string):Promise<GroupMessage>
}