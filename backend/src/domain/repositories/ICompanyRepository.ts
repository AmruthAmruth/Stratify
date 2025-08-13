import { Company } from "../entities/Company";


export interface ICompanyRepository{
    create(company:Company):Promise<Company>;
    findByEmail(email:string):Promise<Company|null>;
    findByPhone(phone:string):Promise<Company|null>;
    findById(id:string):Promise<Company|null>;
    
}