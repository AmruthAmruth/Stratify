export interface IGetUnreadCountsUseCase {
    execute(userId: string): Promise<Record<string, number>>;
}
