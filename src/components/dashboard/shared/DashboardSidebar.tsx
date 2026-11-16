"use client";

import {
  LayoutDashboard,
  CalendarDays,
  Wrench,
  Building2,
  Users,
  CarFront,
  CalendarCheck,
  UserRound,
  Droplets,
} from "lucide-react";

import Link from "next/link";
import { usePathname } from "next/navigation";



import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,

} from "@/components/ui/sidebar";
import { TUser, TUserRole } from "@/app/types";
// import { DashboardMenuItem } from "@/app/types";

const roleBasedSidebarItems = {
  user: [
    {
      title: "Dashboard",
      href: "/dashboard/user",
      icon: LayoutDashboard,
    },
    {
      title: "My Bookings",
      href: "/dashboard/user/bookings",
      icon: CalendarCheck,
    },
    {
      title: "Upcoming Bookings",
      href: "/dashboard/user/bookings/upcoming",
      icon: CalendarDays,
    },
    {
      title: "My Profile",
      href: "/dashboard/user/profile",
      icon: UserRound,
    },
  ],
  admin: [
    {
      title: "Dashboard",
      href: "/dashboard/admin",
      icon: LayoutDashboard,
    },
    {
      title: "Bookings",
      href: "/dashboard/admin/bookings",
      icon: CalendarCheck,
    },
    {
      title: "Upcoming Bookings",
      href: "/dashboard/admin/bookings/upcoming",
      icon: CalendarDays,
    },
    {
      title: "Users",
      href: "/dashboard/admin/users",
      icon: Users,
    },
    {
      title: "Branches",
      href: "/dashboard/admin/branches",
      icon: Building2,
    },
    {
      title: "Services",
      href: "/dashboard/admin/services",
      icon: Droplets,
    },
    {
      title: "My Profile",
      href: "/dashboard/admin/profile",
      icon: UserRound,
    },
  ],
  branchManager: [
    {
      title: "Dashboard",
      href: "/dashboard/branchManager",
      icon: LayoutDashboard,
    },
    {
      title: "Services",
      href: "/dashboard/branchManager/services",
      icon: Droplets,
    },
    {
      title: "Bookings",
      href: "/dashboard/branchManager/bookings",
      icon: CalendarCheck,
    },
    {
      title: "Upcoming Bookings",
      href: "/dashboard/branchManager/bookings/upcoming",
      icon: CalendarDays,
    },
    {
      title: "My Profile",
      href: "/dashboard/branchManager/profile",
      icon: UserRound,
    },
  ],
};

const DashboardSidebar = ({user}:{user:TUser | null}) => {
  const pathname = usePathname();

  return (
    <Sidebar className="border-r border-gray-200">
      <SidebarHeader className="border-b px-5 py-4">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#122048]">
            <CarFront className="h-6 w-6 text-[#FACC15]" />
          </div>

          <div>
            <h2 className="text-lg font-bold text-[#122048]">
              Cleanify
            </h2>
            <p className="text-xs text-gray-500">
              Admin Dashboard
            </p>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent className="bg-white">
        <SidebarGroup>
          <SidebarGroupLabel className="px-4 py-6 text-xs font-semibold uppercase tracking-wider text-gray-400">
            Management
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu className="gap-2 px-3">
             
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default DashboardSidebar;