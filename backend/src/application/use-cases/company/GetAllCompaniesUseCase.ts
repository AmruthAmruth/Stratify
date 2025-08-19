import { ICompanyRepository } from "../../../domain/repositories/ICompanyRepository";
import { Company } from "../../../domain/entities/Company";


export class GetAllCompnayUseCase{
    constructor(private companyRepository:ICompanyRepository){}

    async execute():Promise<Company[]>{
        return await this.companyRepository.findAll()
    }
}