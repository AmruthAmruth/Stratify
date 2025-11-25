import { CreateGroupUseCase } from "../application/use-cases/chat/CreateGroupUseCase";
import { SendGroupMessageUseCase } from "../application/use-cases/chat/SendGroupMessageUseCase";
import { GetGroupMessagesUseCase } from "../application/use-cases/chat/GetGroupMessagesUseCase";
import { GroupRepository } from "../infrastructure/repositories/GroupRepository";
import { GroupMessageRepository } from "../infrastructure/repositories/GroupMessageRepository";
import { GroupChatController } from "../interfaces/controllers/GroupChatController";

export const GroupChatDI = (): GroupChatController => {
    const groupRepo = new GroupRepository();
    const groupMessageRepo = new GroupMessageRepository();

    const createGroupUseCase = new CreateGroupUseCase(groupRepo);
    const sendGroupMessageUseCase = new SendGroupMessageUseCase(groupMessageRepo);
    const getGroupMessagesUseCase = new GetGroupMessagesUseCase(groupMessageRepo);

    return new GroupChatController(
        createGroupUseCase,
        sendGroupMessageUseCase,
        getGroupMessagesUseCase,
        groupRepo
    );
};
