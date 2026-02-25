"use client";

import DashboardSideNav from "@/components/partials/DashboardSideNav";
import MobileBottomNav from "@/components/MobileBottomNav";
import { SidebarProvider } from "@/components/ui/sidebar";
import { SidebarTitleProvider } from "@/components/partials/SidebarTitleContext";
import React from "react";
import { AuthProvider } from "@/context/AuthContext";
import { usePathname } from "next/navigation";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();

  const showTopNav = pathname === "/dashboard";

  return (
    <>
      <SidebarTitleProvider>
        <SidebarProvider>
          <div className="flex w-full md:h-screen overflow-hidden">
            <div className="hidden md:block w-[8rem] flex-shrink-0">
              <DashboardSideNav />
            </div>

            {/* Main content area */}
            <div className="flex-1 bg-[#fffff] md:min-h-screen md:overflow-y-auto  md:pb-0">
              {/* {showTopNav && <DashboardTopNav />} */}
              <AuthProvider>
                <div className="">{children}</div>
              </AuthProvider>
            </div>
          </div>

          {/* Mobile Bottom Navigation */}

          {/* <MobileBottomNav /> */}
        </SidebarProvider>
      </SidebarTitleProvider>
    </>
  );
};

export default DashboardLayout;
