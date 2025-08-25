export class Department {
  constructor(
    public id: string,
    public name: string,
    public companyId: string,
    public managerId?: string
  ) {}
}