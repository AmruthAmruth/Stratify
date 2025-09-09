import { Manager } from "../entities/Managers";

export interface IManagerRepo {
  create(manager: Partial<Manager>): Promise<Manager>;
  findByEmail(email: string): Promise<Manager | null>;
  findByCompanyId(id:string):Promise<Manager[]>;
  updatePassword(email:string,password:string):Promise<void>
  findById(id:string):Promise<Manager | null>
}