export interface ITempRegistrationRepository {
  save(email: string, data: any, expiresAt: Date): Promise<void>;
  findByEmail(email: string): Promise<any | null>;
  delete(email: string): Promise<void>;
}
