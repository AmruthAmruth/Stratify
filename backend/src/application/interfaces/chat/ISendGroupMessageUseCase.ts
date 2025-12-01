import { GroupMessage } from "../../../domain/entities/GroupMessage";

export interface ISendGroupMessageUseCase {
    execute(
        groupId: string,
        senderId: string,
        message: string,
        messageType?: string,
        fileUrl?: string,
        fileName?: string,
        fileSize?: number,
        mimeType?: string
    ): Promise<GroupMessage>
}