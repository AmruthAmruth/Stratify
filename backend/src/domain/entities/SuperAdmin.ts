export class SuperAdmin {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly password: string,
    public readonly name?: string,
    public readonly profileImage?: string,
  ) { }
}
