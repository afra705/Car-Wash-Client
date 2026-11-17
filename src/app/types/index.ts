import type { LucideIcon } from "lucide-react";

export type TUserRole = "admin" | "user" | "branchManager";

export interface TDashboardMenuItem {
  href: string;
  title: string;
  url: string;
  icon: LucideIcon;
}

export interface TUser {
  id: string;
  name: string;
  email: string;
  role: TUserRole;
}