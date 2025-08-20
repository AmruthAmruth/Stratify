export type CompanyStatus = "pending" | "approved" | "rejected";

export class Company {
  constructor(
    public name: string,
    public email: string,
    public phone: string,
    public industry: string,
    public description: string,
    public businessRegNo: string,
    public address: string,
    public city: string,
    public state: string,
    public country: string,
    public zipcode: string,
    public password: string,
    public status: CompanyStatus = "pending",
    public profileImage?: string,
    public _id?: string,
    public role: "company" | "manager" | "employee" = "company"
  ) {}
} 
 