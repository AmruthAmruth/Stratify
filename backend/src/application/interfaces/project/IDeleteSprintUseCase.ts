export interface IDeleteSprintUseCase {
    execute(sprintId: string): Promise<void>;
}
