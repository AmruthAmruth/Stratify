import { Manager } from "../../../domain/entities/Manager";

export interface IGetManagerByCompanyIdUseCase{
    execute(comanyId:string):Promise<Manager|null>
}