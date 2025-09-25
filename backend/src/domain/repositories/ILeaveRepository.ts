import { Leave } from "../entities/Leave";


export interface ILeaveRepository {
  create(sprint: Leave): Promise<Leave>;
  update(sprint: Leave): Promise<Leave>;
  findById(id: string): Promise<Leave | null>;
  findOverlappingLeave(employeeId:string,startDate:Date,endDate:Date):Promise<Leave|null>
}