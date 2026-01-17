





export interface IBaseRepository<T> {
    




    create(entity: T): Promise<T>;

    




    findById(id: string): Promise<T | null>;

    



    findAll(): Promise<T[]>;

    




    findOne(filter: Record<string, unknown>): Promise<T | null>;

    




    findMany(filter: Record<string, unknown>): Promise<T[]>;

    




    exists(id: string): Promise<boolean>;

    




    count(filter?: Record<string, unknown>): Promise<number>;

    





    update(entity: T): Promise<T>;

    



    delete(id: string): Promise<void>;
}
