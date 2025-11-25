import { Group } from "../../../domain/entities/Group";
import { IGroupRepository } from "../../../domain/repositories/IGroupRepository";
import { ICreateGroupUseCase } from "../../interfaces/chat/ICreateGroupUseCase";



export class CreateGroupUseCase implements ICreateGroupUseCase{
    constructor(
private _groupRepo: IGroupRepository
    ){}

    async execute(name: string, members: string[]): Promise<Group> {
         return this._groupRepo.create(name, members);
    }
}