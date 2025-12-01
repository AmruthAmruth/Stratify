export interface IGetUserCompanyInfoUseCase {
    execute(userId: string, role: string): Promise<{ id: string; name: string; profileImage?: string }>;
}
