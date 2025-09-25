import { Leave } from "../../../domain/entities/Leave";
import { IEmployeeRepository } from "../../../domain/repositories/IEmployeeRepository";
import { ILeaveRepository } from "../../../domain/repositories/ILeaveRepository";
import { AppError } from "../../../interfaces/middleware/ErrorMiddleware";
import { CreateLeaveDTO } from "../../dto/leave/CreateLeaveDTO";
import { ICreateLeaveUseCase } from "../../interfaces/leave/ICreateLeaveUseCase";


export class CreateLeaveUseCase implements ICreateLeaveUseCase{
    constructor(
        private _leaveRepo:ILeaveRepository,
        private _employeeRepo:IEmployeeRepository
    ){}

    async execute(leaveDTO: CreateLeaveDTO): Promise<Leave> {


    const employee = await this._employeeRepo.findById(leaveDTO.employeeId);
    if (!employee) throw new AppError('Employee not found', 404);

const overlappingLeave = await this._leaveRepo.findOverlappingLeave(
  leaveDTO.employeeId,
  leaveDTO.startDate,
  leaveDTO.endDate
);
if (overlappingLeave) throw new AppError('Leave overlaps with existing leave', 400);


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