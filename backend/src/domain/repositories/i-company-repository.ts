import { PaginatedResult } from "../common/pagination";
import { Company } from "../entities/company";


export interface ICompanyRepository{
    create(company:Company):Promise<Company>;
    findByEmail(email:string):Promise<Company | null>;
    findByPhone(phone:string):Promise<Company|null>;
    findById(id:string):Promise<Company|null>;
    updatePassword(email:string,password:string):Promise<void>;
   
    findPaginated(options:{
      page?:number,
      pageSize?:number,
      cursor?:string,
     filter?: Record<string, unknown>;
     sort?: Record<string, 1 | -1>;
    }):Promise<PaginatedResult<Company>>;

    




}