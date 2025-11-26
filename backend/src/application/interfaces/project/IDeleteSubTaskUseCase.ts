export interface IDeleteSubTaskUseCase {
    execute(subtaskId: string): Promise<void>;
}
