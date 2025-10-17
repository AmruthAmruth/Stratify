import { Company } from "../../../domain/entities/Company";

export interface IGetCompanyByIdUseCase {
  execute(id: string): Promise<Company | null>;
}
