import { Model, Document, Types } from "mongoose";

export abstract class BaseRepository<TDomain, TDocument extends Document> {
  protected model: Model<TDocument>;
  protected mapper: {
    toEntity(doc: TDocument): TDomain;
    toEntities(docs: TDocument[]): TDomain[];
  };

  constructor(model: Model<TDocument>, mapper: any) {
    this.model = model;
    this.mapper = mapper;
  }

  async create(data: Partial<TDocument>): Promise<TDomain> {
    const doc = await this.model.create(data);
    return this.mapper.toEntity(doc);
  }

  async findById(id: string): Promise<TDomain | null> {
    const doc = await this.model.findById(id).exec();
    return doc ? this.mapper.toEntity(doc) : null;
  }

  async findByEmail(email: string): Promise<TDomain | null> {
    const doc = await this.model.findOne({ email }).exec();
    return doc ? this.mapper.toEntity(doc) : null;
  }

  async updatePassword(email: string, password: string): Promise<void> {
    await this.model.updateOne({ email }, { $set: { password } }).exec();
  }

  async findByCompanyId(companyId: string): Promise<TDomain[]> {
    const docs = await this.model
      .find({ companyId: new Types.ObjectId(companyId) })
      .exec();
    return this.mapper.toEntities(docs);
  }

  async totalInACompany(companyId: string): Promise<number> {
    return await this.model.countDocuments({ companyId }).exec();
  }
}
