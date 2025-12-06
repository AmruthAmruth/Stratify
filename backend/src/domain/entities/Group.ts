export class Group {
  constructor(
    public id: string,
    public name: string,
    public members: string[],
    public createdAt: Date = new Date(),
    public updatedAt?: Date,
    public departmentId?: string
  ) { }
}