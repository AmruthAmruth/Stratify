export interface SuperAdminProfileResponse {
  id?: string;
  email: string;
  name: string | undefined;
  profileImage?: string;
}

export interface IGetSuperAdminProfileUseCase {
  execute(id: string): Promise<SuperAdminProfileResponse>;
}
