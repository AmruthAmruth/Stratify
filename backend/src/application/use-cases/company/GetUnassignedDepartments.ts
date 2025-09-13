import { IDepartmentRepository } from "../../../domain/repositories/IDepartmentRepository";
import { UnassignedDepartmentDTO } from "../../dto/company/UnassignedDepartmentDTO";
import { IGetUnassignedDepartments } from "../../interfaces/company/IGetUnassignedDepartmentsUseCase";


export class GetUnassignedDepartmentUseCase implements IGetUnassignedDepartments{

    constructor(
        private _departmentRepo:IDepartmentRepository
    ){}

    async execute(companyId:string): Promise<UnassignedDepartmentDTO[]> {
         const managers = await this._departmentRepo.getUnassignedDepartments(companyId)
       return managers.map(m => ({ id: m.id!, name: m.name }));
       
    }
}