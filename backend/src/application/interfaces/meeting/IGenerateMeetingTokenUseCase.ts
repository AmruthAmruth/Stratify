export interface IGenerateMeetingTokenUseCase{
    execute(roomId:string,userId:string,userName:string):Promise<string>
}