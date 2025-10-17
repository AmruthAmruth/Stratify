export interface CreateEmployeeDTO {
  name: string;
  email: string;
  phone: string;
  dob: Date;
  joiningDate: Date;
  position: string;
  companyId: string;
  departmentId: string;
  gender: "male" | "female" | "other";
  managerId?: string;
  profileImage?: string;
}
