
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User,
  LayoutGrid,
  CarFront,
  Info,
  MessageCircle,
  ChevronDown,
  LayoutDashboard,
  LogOut,
  CircleUserRound,
  type LucideIcon,
} from "lucide-react";

import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

export default function Navbar() {
  const [activeTab, setActiveTab] = useState("Services");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const router = useRouter();

  const { data: session, isPending } = authClient.useSession();

  const navItems: { name: string; icon: LucideIcon; href?: string }[] = [
    { name: "Services", icon: LayoutGrid, href: "/services" },
    { name: "Compare", icon: CarFront },
    { name: "About Us", icon: Info },
  ];

  // Sign Out
  const handleSignOut = async () => {
    try {
      const { error } = await authClient.signOut();

      if (error) {
        toast.error(error.message || "Sign out failed!");
        return;
      }

      toast.success("Logged out successfully!");

      setIsDropdownOpen(false);

      router.push("/signin");
      router.refresh();
    } catch (error) {
      console.error("Sign out error:", error);
      toast.error("Something went wrong!");
    }
  };

  return (
    <header className="w-full shadow-sm">
      {/* Top Dark Navy Bar */}
      <div className="bg-[#122048] text-white px-4 md:px-12 py-2.5 flex items-center justify-between text-xs md:text-sm">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-[#1b2e63] border border-blue-400/30 flex items-center justify-center shadow-inner">
            <CarFront className="w-5 h-5 text-[#FACC15]" />
          </div>
        </Link>

        {/* Right Info & Account */}
        <div className="flex items-center gap-5 md:gap-7">

          <span className="text-gray-200 font-medium tracking-wide">
            Call us now: +880170678-5160
          </span>

          <a
            href="https://wa.me/8801706785160"
            target="_blank"
            rel="noreferrer"
            aria-label="WhatsApp"
            className="text-gray-200 hover:text-[#FACC15] transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
          </a>

          {/* Authentication */}
          {isPending ? (
            <span className="text-gray-300">Loading...</span>
          ) : session ? (

            // Logged In User
            <div className="relative">

              <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 text-gray-200 hover:text-white pb-1 border-b-2 border-[#FACC15] font-medium"
              >
                <User className="w-4 h-4" />

                <span>{session.user.name}</span>

                <ChevronDown
                  className={`w-4 h-4 transition-transform ${
                    isDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 top-10 w-48 bg-white rounded-lg shadow-xl border border-gray-100 py-2 z-50">

                  {/* Dashboard */}
                  <Link
                    href={`/dashboard/${session?.user?.role || 'user'}`}
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    Dashboard
                  </Link>

                  {/* My Profile */}
                  <Link
                    href="/profile"
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    <CircleUserRound className="w-4 h-4" />
                    My Profile
                  </Link>

                  <div className="border-t border-gray-100 my-1" />

                  {/* Sign Out */}
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors w-full"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>

                </div>
              )}
            </div>

          ) : (

            // Not Logged In
            <Link
              href="/signin"
              className="flex items-center gap-1.5 text-gray-200 hover:text-white pb-1 border-b-2 border-[#FACC15] font-medium"
            >
              <User className="w-4 h-4" />
              <span>Login</span>
            </Link>

          )}

        </div>
      </div>

      {/* Bottom White Navigation Bar */}
      <nav className="bg-white border-b border-gray-100 px-4 md:px-12 py-3 flex items-center justify-between">

        {/* Nav Links */}
        <ul className="flex items-center gap-6 md:gap-8">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.name;

            return (
              <li key={item.name}>
                <button
                  onClick={() => {
                    setActiveTab(item.name);

                    if (item.href) {
                      router.push(item.href);
                    }
                  }}
                  className={`flex items-center gap-2 text-sm font-medium pb-2 transition-colors ${
                    isActive
                      ? "text-[#FACC15] border-b-2 border-[#FACC15]"
                      : "text-gray-700 hover:text-[#122048] border-b-2 border-transparent"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </button>
              </li>
            );
          })}
        </ul>

        {/* Book Now CTA */}
        <button className="bg-[#FACC15] hover:bg-[#eab308] text-white font-semibold text-sm px-8 py-2.5 rounded-md shadow-sm transition-colors cursor-pointer">
          Book Now
        </button>

      </nav>
    </header>
  );
}
