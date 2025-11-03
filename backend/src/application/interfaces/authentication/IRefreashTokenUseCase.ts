export interface IRefreashTokenUseCase {
  execute(
    token: string,
  ): Promise<{ accessToken: string; refreshToken: string; user: { _id: string; role: string } }>;
}
