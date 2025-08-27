export interface AddDepartmentWithManagerDTO {
  companyId: string;
  departmentName: string;
  departmentDescription?: string;
  departmentStatus?: "active" | "inactive";

  managerName: string;
  managerEmail: string;
  managerPhone: string;
  managerJoiningDate?: string;
  managerProfileImage?: string;
}
