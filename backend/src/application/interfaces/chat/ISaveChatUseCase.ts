import { Chat } from "../../../domain/entities/Chat";


export interface ISaveChatUseCase{
    execute(senderId:string,receiverId:string,message:string):Promise<Chat>
}