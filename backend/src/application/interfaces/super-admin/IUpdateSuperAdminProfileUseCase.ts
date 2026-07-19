export interface SuperAdminProfileResponse {
  id?: string;
  email: string;
  name: string | undefined;
  profileImage?: string;
}

export interface IUpdateSuperAdminProfileUseCase {
  execute(id: string, data: { name?: string; profileImage?: string }): Promise<SuperAdminProfileResponse>;
}
