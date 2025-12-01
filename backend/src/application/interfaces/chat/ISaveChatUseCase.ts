import { Chat } from "../../../domain/entities/Chat";


export interface ISaveChatUseCase {
    execute(
        senderId: string,
        receiverId: string,
        message: string,
        messageType?: string,
        fileUrl?: string,
        fileName?: string,
        fileSize?: number,
        mimeType?: string
    ): Promise<Chat>
}