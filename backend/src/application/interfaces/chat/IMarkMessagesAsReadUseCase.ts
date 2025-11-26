export interface IMarkMessagesAsReadUseCase {
    execute(userId: string, senderId: string): Promise<void>;
}
