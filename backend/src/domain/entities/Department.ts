export class Department {
  constructor(
    public id: string | undefined,
    public name: string,
    public description?: string,
    public companyId?: string, 
    public managerId?: string,
    public createdAt?: Date,
    public updatedAt?: Date
  ) {}
}