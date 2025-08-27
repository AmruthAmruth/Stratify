import { Company } from "../entities/company";

export interface ITempRegistrationRepository {
  save(email: string, data: Company, expiresAt: Date): Promise<void>;
  findByEmail(email: string): Promise<Company | null>;
  delete(email: string): Promise<void>;
}

