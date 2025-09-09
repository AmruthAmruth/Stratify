export class Employee {
  constructor(
    public id: string | undefined,
    public name: string,
    public email: string,
    public phone: string,
    public dob: Date,
    public joiningDate: Date,
    public position: string,
    public password: string,
    public companyId: string,
    public departmentId: string,
    public gender: "male" | "female" | "other",
    public role: "employee" = "employee",
    public managerId?: string,
    public profileImage?: string,
    public createdAt?: Date,
    public updatedAt?: Date
  ) {}
}
