'use client'

import DashboardSideNav from '@/components/partials/DashboardSideNav'
import MobileBottomNav from '@/components/MobileBottomNav'
import { SidebarProvider } from '@/components/ui/sidebar'
import { SidebarTitleProvider } from '@/components/partials/SidebarTitleContext'
import React from 'react'
import { AuthProvider } from "@/context/AuthContext";
import { usePathname } from 'next/navigation'
import ProtectedRoute from '@/components/auth/ProtectedRoute'

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname()

  
  const showTopNav = pathname === '/dashboard'

  return (
<ProtectedRoute>
    <SidebarTitleProvider>
      <SidebarProvider>
        <div className="flex w-full h-screen overflow-hidden">
          
          <div className="hidden md:block w-[8rem] flex-shrink-0">
            <DashboardSideNav />
          </div>

          {/* Main content area */}
          <div className="flex-1 bg-[#fffff] min-h-screen overflow-y-auto pb-24 md:pb-0">
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
    </ProtectedRoute>
  )
}

export default DashboardLayout





