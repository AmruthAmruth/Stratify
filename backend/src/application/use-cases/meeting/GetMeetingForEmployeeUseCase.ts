import { Meeting } from "../../../domain/entities/Meeting";
import { IEmployeeRepository } from "../../../domain/repositories/IEmployeeRepository";
import { IMeetingRepository } from "../../../domain/repositories/IMeetingRepository";
import { IGetMeetingsForEmployeeUseCase } from "../../interfaces/meeting/IGetMeetingForEmployeeUseCase";



export class GetMeetingForEmployeeUseCase implements IGetMeetingsForEmployeeUseCase{
    constructor(
            private _meetingRepo:IMeetingRepository,
            private _employeeRepo:IEmployeeRepository
    ){}
    async execute(employeeId: string): Promise<Meeting[]> {
                const employee = await this._employeeRepo.findById(employeeId);
                const managerId=employee?.managerId

                const meetings = await this._meetingRepo.findMeetingByCreatorId(managerId!)
                return meetings
    }
}