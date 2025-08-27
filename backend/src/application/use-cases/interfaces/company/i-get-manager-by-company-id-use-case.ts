import { Manager } from "../../../../domain/entities/manager";

export interface IGetManagerByCompanyIdUseCase{
    execute(comanyId:string):Promise<Manager|null>
}