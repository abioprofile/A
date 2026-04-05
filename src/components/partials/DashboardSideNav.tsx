"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { dropdownVariants } from "@/lib/animations";
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
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { clearAuth } from "@/stores/slices/auth.slice";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const DashboardSideNav = ({
  ...props
}: React.ComponentProps<typeof Sidebar>) => {
  const pathname = usePathname();
  const router = useRouter();
  const { setTitle } = useSidebarTitle();
  const currentUser = useAppSelector((state) => state.auth.user);
  const [showMenu, setShowMenu] = useState(false);
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  const handleLogout = () => {
    dispatch(clearAuth());
    queryClient.clear()
    setShowMenu(false);
    toast.success("Logged out successfully");
    router.push("/auth/sign-in");
  };

  const menuItems = [
    { icon: CreditCard, label: "Billing", href: "/dashboard/Billing" },
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
                // Use activeIcon if it exists and is active, otherwise use default icon
                const iconSrc = isActive && item.activeIcon ? item.activeIcon : item.icon;
                
                return (
                  <Link
                    key={item.title}
                    href={item.url}
                    onClick={() => setTitle(item.title)}
                    className="flex justify-center"
                  >
                    <SidebarMenuItem>
                      <motion.div
                        whileHover={{ scale: 1.1, transition: { duration: 0.16, ease: [0.25, 0.46, 0.45, 0.94] } }}
                        whileTap={{ scale: 0.9, transition: { duration: 0.1 } }}
                      >
                        <SidebarMenuButton
                          className={`cursor-pointer w-12 h-12 flex items-center justify-center transition-colors duration-150 hover:bg-[#f4f4f4] ${
                            isActive ? "bg-[#f0f0f0] shadow-sm" : ""
                          }`}
                        >
                          <div className="relative w-10 h-10">
                            <img
                              src={iconSrc}
                              alt={`${item.title} Icon`}
                              className="w-full h-full object-contain"
                            />
                          </div>
                        </SidebarMenuButton>
                      </motion.div>
                    </SidebarMenuItem>
                  </Link>
                );
              })}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>

        {/* Footer */}
        <SidebarFooter className="pb-6 w-full flex flex-col items-center space-y-3 relative">
          {/* Settings icon */}
          <Link href="/dashboard/AccountSettings">
            <motion.button
              whileHover={{ scale: 1.12, transition: { duration: 0.16 } }}
              whileTap={{ scale: 0.88, transition: { duration: 0.1 } }}
              className="p-2 cursor-pointer rounded-lg hover:bg-[#f4f4f4] transition-colors duration-150"
            >
              <Settings
                size={25}
                color={pathname === "/dashboard/AccountSettings" ? "#FF0000" : "#331400"}
              />
            </motion.button>
          </Link>

          {/* More / Menu Button */}
          <motion.button
            whileHover={{ scale: 1.12, transition: { duration: 0.16 } }}
            whileTap={{ scale: 0.88, transition: { duration: 0.1 } }}
            className="p-2 cursor-pointer rounded-lg hover:bg-[#f4f4f4] transition-colors duration-150"
            onClick={() => setShowMenu(!showMenu)}
          >
            <MoreHorizontal size={30} color="#331400" />
          </motion.button>
        </SidebarFooter>
      </Sidebar>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {showMenu && (
          <>
            {/* Transparent backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="fixed inset-0 bg-transparent z-[9998]"
              onClick={() => setShowMenu(false)}
            />

            {/* Dropdown panel — scale-in from bottom-left origin */}
            <motion.div
              variants={dropdownVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              style={{ transformOrigin: "bottom left" }}
              className="fixed bottom-12 left-24 w-56 bg-white border border-gray-100 shadow-[0_8px_32px_rgba(0,0,0,0.12)] z-[99999]"
            >
              {/* User Info */}
              <div className="flex items-center gap-3 p-4 border-b border-gray-100">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200">
                  <Image
                    src={currentUser?.profile?.avatarUrl || "/icons/Profile Picture.png"}
                    alt="User Avatar"
                    width={40}
                    height={40}
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm">
                    {currentUser?.name}
                  </h3>
                  <p className="text-xs text-gray-500">@{currentUser?.profile?.username}</p>
                </div>
              </div>

              {/* Menu Items */}
              <div className="p-2">
                {menuItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.label}
                      href={item.href || "#"}
                      className={`flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg transition-colors duration-150 ${
                        isActive
                          ? "bg-gray-100 text-gray-900"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <item.icon
                        size={16}
                        color={isActive ? "#FF0000" : "currentColor"}
                      />
                      {item.label}
                    </Link>
                  );
                })}
              </div>

              {/* Logout */}
              <div className="border-t border-gray-100 p-2">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-lg w-full transition-colors duration-150"
                >
                  <LogOut size={16} />
                  Log Out
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default DashboardSideNav;