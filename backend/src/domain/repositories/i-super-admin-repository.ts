import { SuperAdmin } from "../entities/super-admin";

export interface ISuperAdminRepository{
    findByEmail(email:string):Promise<SuperAdmin|null>;
}