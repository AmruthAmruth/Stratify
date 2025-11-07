export class Notification {
  constructor(
    public readonly id: string | undefined,
    public readonly userId: string,
    public readonly role: "company" | "manager" | "employee",
    public readonly title: string,
    public readonly message: string,
    public readonly type: "info" | "success" | "warning" | "error",
    public readonly isRead: boolean = false,
    public readonly createdAt: Date = new Date()
  ) {}

  markAsRead(): Notification {
    if (this.isRead) return this;
    return new Notification(
      this.id,
      this.userId,
      this.role,
      this.title,
      this.message,
      this.type,
      true,
      this.createdAt
    );
  }

  markAsUnread(): Notification {
    if (!this.isRead) return this;
    return new Notification(
      this.id,
      this.userId,
      this.role,
      this.title,
      this.message,
      this.type,
      false,
      this.createdAt
    );
  }
}
