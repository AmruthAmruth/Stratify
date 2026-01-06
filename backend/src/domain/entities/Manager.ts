export class Manager {
  constructor(
    public id: string | undefined,
    public name: string,
    public email: string,
    public phone: string,
    public password: string,
    public role: "manager",
    public position: string,
    public joiningDate: Date,
    public gender: "male" | "female" | "other",
    public dob: Date,
    public companyId: string,
    public departmentId?: string,
    public profileImage?: string,
    public address?: string,
  ) { }
}
