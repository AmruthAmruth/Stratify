import { IMeetingRepository } from "../../../domain/repositories/IMeetingRepository";
import { IGenerateMeetingTokenUseCase } from "../../interfaces/meeting/IGenerateMeetingTokenUseCase";



export class GenerateMeetingTokenUseCase implements IGenerateMeetingTokenUseCase{
    constructor(
     private _meetingRepo:IMeetingRepository,
     private _zegoTokenService:
    ){}

    async execute(roomId: string, userId: string, userName: string): Promise<void> {
        
    }
}