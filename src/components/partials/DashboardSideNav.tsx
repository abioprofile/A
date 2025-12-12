"use client";

import React, { useState } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../ui/sidebar";
import Image from "next/image";
import Link from "next/link";
import { sidebarNav } from "@/data";
import { usePathname, useRouter } from "next/navigation";
import { useSidebarTitle } from "@/components/partials/SidebarTitleContext";
import {
  Bell,
  MoreHorizontal,
  Settings,
  Moon,
  LogOut,
  CreditCard,
} from "lucide-react";
import { useAppDispatch } from "@/stores/hooks";
import { clearAuth } from "@/stores/slices/auth.slice";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const DashboardSideNav = ({
  ...props
}: React.ComponentProps<typeof Sidebar>) => {
  const pathname = usePathname();
  const router = useRouter();
  const { setTitle } = useSidebarTitle();
  const [showMenu, setShowMenu] = useState(false);
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  const handleLogout = () => {
    // Clear Redux state (this also clears localStorage)
    dispatch(clearAuth());
    
    // Clear React Query cache
    queryClient.clear();
    
    // Close the menu
    setShowMenu(false);
    
    // Show success message
    toast.success("Logged out successfully");
    
    // Redirect to sign-in page
    router.push("/auth/sign-in");
  };

  const menuItems = [
    // { icon: User, label: "Profile", href: "/profile" },
    { icon: CreditCard, label: "Billing", href: "/dashboard/Billing" },
    // { icon: Bell, label: "Notifications", href: "/notifications" },
    { icon: Settings, label: "Account Settings", href: "/dashboard/AccountSettings" },
    { icon: Moon, label: "Light Mode", action: "toggle-theme" },
  ];

  return (
    <>
      <Sidebar
        collapsible="icon"
        {...props}
        className="h-full w-[8rem] bg-white flex flex-col items-center justify-between"
      >
        {/* Header */}
        <SidebarHeader className="flex justify-center items-center mb-16">
          {/* <Logo width={28} height={28} /> */}
          <Image
            src='/icons/logo.png'
            alt='A logo'
            width={60}
            height={60}
            className='max-[380px]:size-10 size-9 md:size-10'
            priority
          />
        </SidebarHeader>

        {/* Sidebar Nav Icons */}
        <SidebarContent className="flex-1 flex flex-col items-center justify-start">
          <SidebarGroup className="w-full">
            <SidebarMenu className="space-y-4 flex flex-col items-center">
              {sidebarNav.map((item) => {
                const isActive = pathname === item.url;
                return (
                  <Link
                    key={item.title}
                    href={item.url}
                    onClick={() => setTitle(item.title)}
                    className="flex justify-center"
                  >
                    <SidebarMenuItem>
                      <SidebarMenuButton
                        className={`cursor-pointer w-9 h-9 flex items-center justify-center rounded-lg transition-all hover:bg-[#f4f4f4] ${isActive ? "bg-[#f4f4f4] shadow-sm" : ""
                          }`}
                      >
                        <Image
                          src={item.icon}
                          alt={`${item.title} Icon`}
                          width={20}
                          height={20}
                          style={{
                            filter: isActive
                              ? "invert(25%) sepia(98%) saturate(7300%) hue-rotate(355deg) brightness(98%) contrast(100%)"
                              : "invert(14%) sepia(15%) saturate(2076%) hue-rotate(347deg) brightness(94%) contrast(87%)",
                          }}
                        />
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </Link>
                );
              })}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>

        {/* Footer */}
        <SidebarFooter className="pb-6 w-full flex flex-col items-center space-y-3 relative">
          <button className="p-2 rounded-lg hover:bg-[#f4f4f4]">
            <Bell size={18} color="#331400" />
          </button>

          {/* More / Menu Button */}
          <button
            className="p-2 rounded-lg hover:bg-[#f4f4f4]"
            onClick={() => setShowMenu(!showMenu)}
          >
            <MoreHorizontal size={18} color="#331400" />
          </button>
        </SidebarFooter>
      </Sidebar>

      {/* ✅ Fixed Dropdown Menu */}
      {showMenu && (
        <>
          {/* Transparent overlay to close */}
          <div
            className="fixed inset-0 bg-transparent z-[9998]"
            onClick={() => setShowMenu(false)}
          />

          {/* Dropdown itself */}
          <div className="fixed bottom-12 left-24 w-56 bg-white border border-gray-200 shadow-2xl  z-[99999] animate-fadeIn">
            {/* User Info */}
            <div className="flex items-center gap-3 p-4 border-b border-gray-100">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200">
                <Image
                  src="/avatar.jpg"
                  alt="User Avatar"
                  width={40}
                  height={40}
                  className="object-cover"
                />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-sm">
                  David Oshinowo
                </h3>
                <p className="text-xs text-gray-500">Active</p>
              </div>
            </div>

            {/* Menu Items */}
            <div className="p-2">
              {menuItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href || "#"}
                  className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition"
                >
                  <item.icon size={16} />
                  {item.label}
                </Link>
              ))}
            </div>

            {/* Logout */}
            <div className="border-t border-gray-100 p-2">
              <button 
                onClick={handleLogout}
                className="flex items-center gap-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg w-full transition"
              >
                <LogOut size={16} />
                Log Out
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default DashboardSideNav;









