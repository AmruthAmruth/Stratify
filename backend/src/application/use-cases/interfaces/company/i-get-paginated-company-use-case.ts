import { PaginatedResult } from "../../../../domain/common/pagination";
import { Company } from "../../../../domain/entities/company";

export interface IGetPaginatedCompaniesUseCase {
  execute(params: {
    page?: number;
    pageSize?: number;
    cursor?: string;
    filter?: Record<string, unknown>;
    sort?: Record<string, 1 | -1>;
  }): Promise<PaginatedResult<Company>>;
}
