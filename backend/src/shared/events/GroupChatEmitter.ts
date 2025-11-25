import {
    emitGroupMessage,
    emitGroupTyping,
    emitGroupMemberJoined,
    emitGroupMemberLeft,
} from "../../infrastructure/socket/SocketServer";
import { io } from "../../main";

export class GroupChatEmitter {
    static emitMessage(
        groupId: string,
        senderId: string,
        message: string,
        createdAt: string,
        senderName: string
    ) {
        emitGroupMessage(io, groupId, { senderId, message, createdAt, senderName });
     }

    static emitTyping(groupId: string, senderId: string) {
        emitGroupTyping(io, groupId, senderId);
    }

    static emitMemberJoined(groupId: string, userId: string, userName: string) {
        emitGroupMemberJoined(io, groupId, userId, userName);
    }

    static emitMemberLeft(groupId: string, userId: string, userName: string) {
        emitGroupMemberLeft(io, groupId, userId, userName);
    }
}
