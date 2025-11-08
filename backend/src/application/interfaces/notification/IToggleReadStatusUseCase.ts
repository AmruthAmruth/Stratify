export interface IToggleReadStatusUseCase {
  execute(notificationId: string): Promise<void>;
}