
export interface IDeleteNotificationUseCase {
    execute(id:string):Promise<void>
}