import { Manager } from "../../../domain/entities/Managers";

export interface IGetManagerByCompanyIdUseCase{
    execute(comanyId:string):Promise<Manager|null>
}