import { Manager } from "../entities/Manager";

export interface IManagerRepo {
  create(manager: Partial<Manager>): Promise<Manager>;
  findByEmail(email: string): Promise<Manager | null>;
}