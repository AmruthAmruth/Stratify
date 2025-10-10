import { IssueLevelEmployeeAllocationDTO } from "../../dto/project/IssueLeavelEmployeeAllocationDTO";


export interface IGetEmployeeNotInProjectUseCase{
    execute(projectId:string,departmentId:string):Promise<IssueLevelEmployeeAllocationDTO[]>
}