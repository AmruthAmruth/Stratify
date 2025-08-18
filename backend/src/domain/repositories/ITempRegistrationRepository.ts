import { Company } from "../entities/Company";

export interface ITempRegistrationRepository {
  save(email: string, data: Company, expiresAt: Date): Promise<void>;
  findByEmail(email: string): Promise<Company | null>;
  delete(email: string): Promise<void>;
}

