import { PaginatedResult } from "../common/Pagination";
import { Company } from "../entities/Company";


export interface ICompanyRepository{
    create(company:Company):Promise<Company>;
    findByEmail(email:string):Promise<{
    id: string;
    name: string;
    email: string;
    password: string; 
    role: "company" | "manager" | "employee";
  } | null>;
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