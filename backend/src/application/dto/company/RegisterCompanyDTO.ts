export interface RegisterCompanyDTO {
  name: string;
  email: string;
  phone: string;
  industry: string;
  description?: string;
  businessRegNo: string;
  address: string;
  city: string;
  state: string;
  country: string;
  zipcode: string;
  password: string;
  profileImage?: string;
}
