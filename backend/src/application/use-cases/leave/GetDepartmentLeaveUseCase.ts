import { ILeaveRepository } from "../../../domain/repositories/ILeaveRepository";
import { AppError } from "../../../interfaces/middleware/ErrorMiddleware";
import { StatusCodes } from "../../../shared/constants/statusCodes";
import { DepartmentLeaveDTO } from "../../dto/leave/GetDepartmentLeaveDTO";
import { IGetDepartmentLeaveUseCase } from "../../interfaces/leave/IGetDepartmentLeavsUseCase";




export class GetDepartmentLeaveUseCase implements IGetDepartmentLeaveUseCase{

    constructor(
        private _leaveRepo:ILeaveRepository,
        private _managerRepo:IManagerRepository
    ){}


    async execute(managerId: string): Promise<DepartmentLeaveDTO> {
        const manager = await this._managerRepo.findById(managerId);
        
            if (!manager) {
              throw new AppError("Manager not found", StatusCodes.NOT_FOUND);
            }


            



    }


}