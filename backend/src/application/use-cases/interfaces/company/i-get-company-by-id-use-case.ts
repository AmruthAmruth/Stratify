import { Company } from "../../../../domain/entities/company";

export interface IGetCompanyByIdUseCase {
  execute(id: string): Promise<Company | null>;
}