import { Leave } from "../entities/Leave";


export interface ILeaveRepository {
  create(sprint: Leave): Promise<Leave>;
  update(sprint: Leave): Promise<Leave>;
  findById(id: string): Promise<Leave | null>;
  findOverlappingLeave(employeeId:string,startDate:Date,endDate:Date):Promise<Leave|null>
  countLeaveDays(employeeId:string,start:Date,end:Date,leaveType:string):Promise<number>
 getLeavesByEmployeeAndDateRange(startOfMonth:Date,endOfMonth:Date):Promise<Leave[]>
 countLeaveDaysByMonth(employeeId:string, month: number, type: string):Promise<number>
 findLeavesByEmployeeAndMonth(employeeId:string,month:number):Promise<Leave[]>
 findLeavesByDepartment(departmentId:string,currentMonth:number):Promise<Leave[]>
}