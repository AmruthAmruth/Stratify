import { GroupMessage } from "../../../domain/entities/GroupMessage";
import { IGroupMessageRepository } from "../../../domain/repositories/IGroupMessageRepository";
import { ISendGroupMessageUseCase } from "../../interfaces/chat/ISendGroupMessageUseCase";

export class SendGroupMessageUseCase implements ISendGroupMessageUseCase {
  constructor(private _groupMessageRepo: IGroupMessageRepository) { }

  async execute(
    groupId: string,
    senderId: string,
    message: string,
    messageType?: string,
    fileUrl?: string,
    fileName?: string,
    fileSize?: number,
    mimeType?: string
  ): Promise<GroupMessage> {
    return this._groupMessageRepo.saveMessage(
      groupId,
      senderId,
      message,
      messageType,
      fileUrl,
      fileName,
      fileSize,
      mimeType
    );
  }
}
