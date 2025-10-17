export interface ProfileDTO {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  position: string;
  companyId: string;
  departmentId?: string;
  departmentName?: string;
  profileImage?: string;
  dob: Date;
  gender?: string;
  joiningDate: Date;
  experience?: number;
  age?: number;
}
