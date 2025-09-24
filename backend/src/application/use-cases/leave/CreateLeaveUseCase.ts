import { Leave } from "../../../domain/entities/Leave";
import { ILeaveRepository } from "../../../domain/repositories/ILeaveRepository";
import { CreateLeaveDTO } from "../../dto/leave/CreateLeaveDTO";
import { ICreateLeaveUseCase } from "../../interfaces/leave/ICreateLeaveUseCase";


export class CreateLeaveUseCase implements ICreateLeaveUseCase{
    constructor(
        private _leaveRepo:ILeaveRepository
    ){}

    async execute(leaveDTO: CreateLeaveDTO): Promise<Leave> {
        const leave = new Leave(
      undefined,                     
      leaveDTO.employeeId,
      leaveDTO.startDate,
      leaveDTO.endDate,
      leaveDTO.type ?? "Casual",     
      "Pending",                     
      leaveDTO.reason,
      new Date(),                   
      new Date()                     
    );
    return await this._leaveRepo.create(leave);
    }

}