import DashboardSidebar from "@/components/dashboard/shared/DashboardSidebar";
import {
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Get logged-in user session
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // Redirect if user is not logged in
  if (!session) {
    redirect("/signin");
  }

  // Get user information
  const user = session.user;

  return (
    <SidebarProvider>
      <DashboardSidebar user={user} />

      <main className="flex-1 min-w-0 bg-gray-50">
        <header className="flex h-14 items-center bg-white px-4">
          <SidebarTrigger />
          <h1 className="ml-4 font-semibold text-[#122048]">
            Dashboard
          </h1>
        </header>

        <div className="p-6">{children}</div>
      </main>
    </SidebarProvider>
  );
}