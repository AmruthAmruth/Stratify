import { ICompanyRepository } from "../../../domain/repositories/ICompanyRepository";
import { Company } from "../../../domain/entities/Company";


export class GetCompanyByIdUseCase{
    constructor(private companyRepository:ICompanyRepository){};

    async execute(id:string):Promise<Company|null>{
        const company = await this.companyRepository.findById(id)
        if(!company){
         throw new Error("Company not found")
        }
        return company
    }
}