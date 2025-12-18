import { Model, FilterQuery } from "mongoose";
import { IBaseRepository } from "../../domain/repositories/IBaseRepository";
import { AppError } from "../../interfaces/middleware/ErrorMiddleware";
import { StatusCodes } from "../../shared/constants/statusCodes";


export abstract class BaseRepository<TEntity, TDocument> implements IBaseRepository<TEntity> {

    constructor(
        protected model: Model<TDocument>,
        protected mapper: {
            toEntity: (doc: TDocument) => TEntity;
            toDocument: (entity: TEntity) => Partial<TDocument>;
            toEntities?: (docs: TDocument[]) => TEntity[];
        }
    ) { }


    async create(entity: TEntity): Promise<TEntity> {
        const doc = await this.model.create(this.mapper.toDocument(entity) as TDocument);
        return this.mapper.toEntity(doc);
    }


    async findById(id: string): Promise<TEntity | null> {
        const doc = await this.model.findById(id).exec();
        return doc ? this.mapper.toEntity(doc) : null;
    }


    async findAll(): Promise<TEntity[]> {
        const docs = await this.model.find().exec();
        return this.mapper.toEntities
            ? this.mapper.toEntities(docs)
            : docs.map(doc => this.mapper.toEntity(doc));
    }


    async findOne(filter: Record<string, unknown>): Promise<TEntity | null> {
        const doc = await this.model.findOne(filter as FilterQuery<TDocument>).exec();
        return doc ? this.mapper.toEntity(doc) : null;
    }


    async findMany(filter: Record<string, unknown>): Promise<TEntity[]> {
        const docs = await this.model.find(filter as FilterQuery<TDocument>).exec();
        return this.mapper.toEntities
            ? this.mapper.toEntities(docs)
            : docs.map(doc => this.mapper.toEntity(doc));
    }


    async exists(id: string): Promise<boolean> {
        const doc = await this.model.findById(id).select('_id').exec();
        return doc !== null;
    }


    async count(filter?: Record<string, unknown>): Promise<number> {
        return await this.model.countDocuments(filter as FilterQuery<TDocument>).exec();
    }


    async update(entity: TEntity & { id: string }): Promise<TEntity> {
        const updated = await this.model.findByIdAndUpdate(
            entity.id,
            this.mapper.toDocument(entity),
            { new: true }
        ).exec();

        if (!updated) {
            throw new AppError("Entity not found", StatusCodes.NOT_FOUND);
        }

        return this.mapper.toEntity(updated);
    }


    async delete(id: string): Promise<void> {
        await this.model.findByIdAndDelete(id).exec();
    }
}
