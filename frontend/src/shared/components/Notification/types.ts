export interface INotification {
  id?: string;
  userId?: string;
  role?: "company" | "manager" | "employee";
  title: string;
  message: string;
  type?: "info" | "success" | "warning" | "error";
  isRead: boolean;
  createdAt: string;
}