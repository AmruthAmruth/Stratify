import { Leave } from "../entities/Leave";


export interface ILeaveRepository {
  create(sprint: Leave): Promise<Leave>;
  update(sprint: Leave): Promise<Leave>;
  findById(id: string): Promise<Leave | null>;
  findOverlappingLeave(employeeId:string,startDate:Date,endDate:Date):Promise<Leave|null>
  countLeaveDays(employeeId:string,start:Date,end:Date,leaveType:string):Promise<number>
 getCurrentMonthLeavesByEmployeeId(employeeId: string, month: number, year: number): Promise<Leave[]>;
}