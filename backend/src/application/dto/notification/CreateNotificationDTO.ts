export interface CreateNotificationDTO {
  userId: string;
  role: "Company" | "Manager" | "Employee";
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
}