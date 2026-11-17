
"use client";

import {
  LayoutDashboard,
  CalendarDays,
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
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import type {
  TUser,
  TUserRole,
 
} from "@/app/types";


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


const DashboardSidebar = ({ user }: { user: TUser | null }) => {
  const pathname = usePathname();

  const role: TUserRole =
    user?.role && user.role in roleBasedSidebarItems
      ? user.role as TUserRole
      : "user";

  const sideBarItems = roleBasedSidebarItems[role];

  return (
    <Sidebar className="border-r border-gray-200">

      {/* Sidebar Header */}
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
              {role === "admin"
                ? "Admin Dashboard"
                : role === "branchManager"
                ? "Branch Manager"
                : "User Dashboard"}
            </p>
          </div>

        </Link>
      </SidebarHeader>


      {/* Sidebar Content */}
      <SidebarContent className="bg-white">

        <SidebarGroup>

          <SidebarGroupLabel className="px-4 py-6 text-xs font-semibold uppercase tracking-wider text-gray-400">
            Management
          </SidebarGroupLabel>

          <SidebarGroupContent>

            <SidebarMenu className="gap-2 px-3">

              {sideBarItems.map((item) => {
                const Icon = item.icon;

                const isActive =
                  pathname === item.href ||
                  (item.href !== `/dashboard/${role}` &&
                    pathname.startsWith(`${item.href}/`));

                return (
                  <SidebarMenuItem key={item.href}>

                    <SidebarMenuButton
             
                      isActive={isActive}
                      tooltip={item.title}
                      className={`h-11 rounded-lg px-3 transition-all ${
                        isActive
                          ? "bg-[#122048] text-white hover:bg-[#122048] hover:text-white"
                          : "text-gray-600 hover:bg-gray-100 hover:text-[#122048]"
                      }`}
                    >
                      <Link href={item.href} className="flex items-center gap-2">

                        <Icon className="h-5 w-5" />

                        <span className="font-medium">
                          {item.title}
                        </span>

                      </Link>
                    </SidebarMenuButton>

                  </SidebarMenuItem>
                );
              })}

            </SidebarMenu>

          </SidebarGroupContent>

        </SidebarGroup>

      </SidebarContent>

    </Sidebar>
  );
};

export default DashboardSidebar;
