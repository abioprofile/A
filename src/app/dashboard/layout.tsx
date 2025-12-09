'use client'

import DashboardSideNav from '@/components/partials/DashboardSideNav'
import { SidebarProvider } from '@/components/ui/sidebar'
import { SidebarTitleProvider } from '@/components/partials/SidebarTitleContext'
import React from 'react'
import { AuthProvider } from "@/context/AuthContext";
import { usePathname } from 'next/navigation'

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname()

  
  const showTopNav = pathname === '/dashboard'

  return (
    <SidebarTitleProvider>
      <SidebarProvider>
        <div className="flex w-full h-screen overflow-hidden">
          
          <div className="w-[8rem] flex-shrink-0">
            <DashboardSideNav />
          </div>

          {/* Main content area */}
          <div className="flex-1 bg-[#fffff] min-h-screen overflow-y-auto">
            {/* {showTopNav && <DashboardTopNav />} */}
             <AuthProvider>       
                      
            <div className="">{children}</div>
                </AuthProvider>
          </div>
        </div>
      </SidebarProvider>
    </SidebarTitleProvider>
  )
}

export default DashboardLayout





