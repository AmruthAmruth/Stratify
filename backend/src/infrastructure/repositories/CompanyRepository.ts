import { ICompanyRepository } from "../../domain/repositories/ICompanyRepository";
import { Company } from "../../domain/entities/Company";
import CompanyModel, { ICompanyDoc } from "../models/CompanyModel";
import { FilterQuery } from "mongoose";
import { PaginatedResult } from "../../domain/common/Pagination";
import { BaseRepository } from "./BaseRepository";
import { CompanyMapper } from "../mappers/CompanyMapper";

export class CompanyRepository extends BaseRepository<Company, ICompanyDoc> implements ICompanyRepository {
  constructor() {
    super(CompanyModel, CompanyMapper);
  }

  async findByEmail(email: string): Promise<Company | null> {
    return this.findOne({ email });
  }

  async findByPhone(phone: string): Promise<Company | null> {
    return this.findOne({ phone });
  }

  async updatePassword(email: string, password: string): Promise<void> {
    await CompanyModel.updateOne({ email }, { $set: { password } });
  }

  async findPaginated(options: {
    page?: number;
    pageSize?: number;
    cursor?: string;
    filter?: FilterQuery<typeof CompanyModel>;
    sort?: { [key: string]: 1 | -1 };
  }): Promise<PaginatedResult<Company>> {
    const {
      page = 1,
      pageSize = 10,
      cursor,
      filter = {},
      sort = { createdAt: -1 }
    } = options;

    if (cursor) {
      const typedFilter: FilterQuery<typeof CompanyModel> = filter;
      typedFilter["createdAt"] = { $lt: new Date(cursor) };
      const data = await CompanyModel.find(filter).sort(sort).limit(pageSize);

      return {
        data: CompanyMapper.toEntities(data),
        total: data.length,
        page,
        pageSize
      };
    } else {
      const total = await CompanyModel.countDocuments(filter);
      const data = await CompanyModel.find(filter)
        .sort(sort)
        .skip((page - 1) * pageSize)
        .limit(pageSize);

      return {
        data: CompanyMapper.toEntities(data),
        total,
        page,
        pageSize
      };
    }
  }

  async approveCompany(id: string): Promise<void> {
    await CompanyModel.findByIdAndUpdate(
      id,
      { status: "approved" },
      { new: true }
    );
  }

  async unapproveCompany(id: string): Promise<void> {
    await CompanyModel.findByIdAndUpdate(
      id,
      { status: "rejected" },
      { new: true }
    );
  }
}
