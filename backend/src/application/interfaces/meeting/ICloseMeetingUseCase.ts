

export interface ICloseMeetingUseCase{
    execute(roomId:string):Promise<void>
}