

export interface IGetGroupMessagesUseCase{
    execute(groupId: string, limit?: number, after?: Date):Promise<unknown>

}