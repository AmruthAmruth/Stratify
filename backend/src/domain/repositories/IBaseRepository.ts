/**
 * Base repository interface defining common CRUD operations for all repositories.
 * All domain repository interfaces should extend this interface.
 * 
 * @template T - The entity type
 */
export interface IBaseRepository<T> {
    /**
     * Creates a new entity in the database
     * @param entity - The entity to create
     * @returns The created entity with generated ID
     */
    create(entity: T): Promise<T>;

    /**
     * Finds an entity by its ID
     * @param id - The entity ID
     * @returns The entity if found, null otherwise
     */
    findById(id: string): Promise<T | null>;

    /**
     * Finds all entities
     * @returns Array of all entities
     */
    findAll(): Promise<T[]>;

    /**
     * Finds a single entity matching the filter
     * @param filter - MongoDB filter query
     * @returns The entity if found, null otherwise
     */
    findOne(filter: Record<string, unknown>): Promise<T | null>;

    /**
     * Finds multiple entities matching the filter
     * @param filter - MongoDB filter query
     * @returns Array of matching entities
     */
    findMany(filter: Record<string, unknown>): Promise<T[]>;

    /**
     * Checks if an entity exists by ID
     * @param id - The entity ID
     * @returns True if entity exists, false otherwise
     */
    exists(id: string): Promise<boolean>;

    /**
     * Counts entities matching the filter
     * @param filter - MongoDB filter query (optional)
     * @returns Count of matching entities
     */
    count(filter?: Record<string, unknown>): Promise<number>;

    /**
     * Updates an existing entity
     * @param entity - The entity to update (must include id)
     * @returns The updated entity
     * @throws AppError if entity not found
     */
    update(entity: T): Promise<T>;

    /**
     * Deletes an entity by its ID
     * @param id - The entity ID to delete
     */
    delete(id: string): Promise<void>;
}
