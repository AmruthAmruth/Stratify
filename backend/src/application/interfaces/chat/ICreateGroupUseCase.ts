import { Group } from "../../../domain/entities/Group";

export interface ICreateGroupUseCase{
    execute(name:string,members:string[]):Promise<Group>
}