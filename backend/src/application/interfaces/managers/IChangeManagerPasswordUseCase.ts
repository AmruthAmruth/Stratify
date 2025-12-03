export interface IChangeManagerPasswordUseCase {
    execute(managerId: string, currentPassword: string, newPassword: string): Promise<void>;
}
