export class Manager {
  constructor(
    public id: string,
    public name: string,
    public email: string,
    public phone: string,
    public status: string,
    public departmentId: string,
    public companyId: string,
    public password: string,
    public role: string,
    public joiningDate?: string,     
    public profileImage?: string 
  ) {}
}