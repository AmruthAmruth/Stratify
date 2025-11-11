

export interface IReadAllNotificationUseCase{
    execute(userId:string):Promise<void>
}