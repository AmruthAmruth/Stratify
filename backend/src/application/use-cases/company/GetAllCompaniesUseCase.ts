import { ICompanyRepository } from "../../../domain/repositories/ICompanyRepository";
import { Company } from "../../../domain/entities/Company";


export class GetAllCompnayUseCase{
    constructor(private _companyRepository:ICompanyRepository){}

    async execute():Promise<Company[]>{
        return await this._companyRepository.findAll()
    }
}