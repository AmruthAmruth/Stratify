export interface IDeleteAllNotificationsUseCase{
    execute(userId:string):Promise<void>
}