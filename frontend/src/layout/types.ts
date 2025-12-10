export type UserRole = "super-admin" | "company" | "manager" | "employee" | "general";

export interface MenuItem {
  label: string;
  path: string;
  icon: string;
}