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
