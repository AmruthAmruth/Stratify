export class Backlog {
  constructor(
    public id: string | undefined,
    public projectId: string,
    public name: string,
    public description: string,
    public createdBy: string,
    public createdAt?: Date,
    public updatedAt?: Date
  ) {}
}