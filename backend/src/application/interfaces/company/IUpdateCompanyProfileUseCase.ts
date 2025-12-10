import { Company } from "../../../domain/entities/Company";

export interface IUpdateCompanyProfileUseCase {
    execute(id: string, data: Partial<Company>): Promise<Company>;
}
