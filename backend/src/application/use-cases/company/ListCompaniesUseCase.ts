import { PaginatedResult } from "../../../domain/common/Pagination";
import { Company } from "../../../domain/entities/Company";
import { ICompanyRepository } from "../../../domain/repositories/ICompanyRepository";
import { IGetPaginatedCompaniesUseCase } from "../../interfaces/company/IListCompanyUseCase";

interface GetPaginatedCompaniesDTO {
  page?: number;
  pageSize?: number;
  cursor?: string;
  filter?: Record<string, unknown>;
  sort?: Record<string, 1 | -1>;
}

export class GetPaginatedCompaniesUsecase implements IGetPaginatedCompaniesUseCase{
  constructor(private readonly _companyRepository: ICompanyRepository) {}

  async execute(
    options: GetPaginatedCompaniesDTO,
  ): Promise<PaginatedResult<Company>> {
    const page = options.page && options.page > 0 ? options.page : 1;
    const pageSize =
      options.pageSize && options.pageSize > 0 ? options.pageSize : 10;

    return await this._companyRepository.findPaginated({
      page,
      pageSize,
      cursor: options.cursor,
      filter: options.filter,
      sort: options.sort,
    });
  }
}
