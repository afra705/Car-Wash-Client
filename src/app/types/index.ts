
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
  branch?: string;
}

export type TServiceStatus = "active" | "pending" | "inactive";

export interface TService {
  image: string;
  _id: string;
  serviceName: string;
  category: string;
  branch: string;
  description?: string;
  price: number;
  location?: string;
  status: TServiceStatus | string;
  createdAt?: string;
}

export interface TServiceInput {
  serviceName: string;
  category: string;
  branch: string;
  description: string;
  price: number;
  location: string;
  status: TServiceStatus;
  createdAt: string;
    createdBy?: string;
    image?: string;
}
