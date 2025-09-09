export interface CreateManagerDTO {
  name: string;
  email: string;
  phone: string;
  position: string;
  joiningDate: Date;
  gender: "male" | "female" | "other";
  dob: Date;
  companyId: string;
  departmentId?: string;
  profileImage?: string;
}