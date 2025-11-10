import { Meeting } from "../../../domain/entities/Meeting";

export interface IGetMeetingsForEmployeeUseCase{
    execute(employeeId:string):Promise<Meeting[]>
}