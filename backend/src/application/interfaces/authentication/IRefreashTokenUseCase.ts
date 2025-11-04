export interface IRefreashTokenUseCase {
  execute(
    token: string,
  ): Promise<{
  accessToken: string;
  refreshToken: string;
}>;
}
