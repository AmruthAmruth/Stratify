export class Employee {
  constructor(
    public readonly id: string,
    public name: string,
    public email: string,
    public phone: string,
    public dob: Date,
    public joiningDate: Date,
    public position: string,
    public managerId: string | undefined,
    public profileImage: string | undefined,
    public departmentId: string,
    public companyId: string,
   public password: string, 
    public status: "active" | "inactive" | "suspended",
    public role: "employee",
    public readonly createdAt: Date,
    public readonly updatedAt: Date  
  ) {}
}