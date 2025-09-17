import { Manager } from "../../../domain/entities/Manager";
import { CreateManagerDTO } from "../../dto/managers/CreateManagerDTO";



export interface ICreateManagerUseCase{
    execute(manager:CreateManagerDTO):Promise<Manager>
}

  