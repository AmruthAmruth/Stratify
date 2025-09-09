import { Department } from "../entities/Department";




export interface IDepartmentRepository{

  findByNameAndCompany(name:string,companyId:string):Promise<Department | null>

  create(department:Department):Promise<Department>

}