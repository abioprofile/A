'use client'

import DashboardSideNav from '@/components/partials/DashboardSideNav'
import DashboardTopNav from '@/components/partials/DashboardTopNav'
import { SidebarProvider } from '@/components/ui/sidebar'
import { SidebarTitleProvider } from '@/components/partials/SidebarTitleContext'
import React from 'react'
import { usePathname } from 'next/navigation'

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname()

  // Show top nav only on main dashboard route
  const showTopNav = pathname === '/dashboard'

  return (
    <SidebarTitleProvider>
      <SidebarProvider>
        <div className="flex w-full h-screen overflow-hidden">
          {/* Sidebar — fixed narrow width */}
          <div className="w-[4rem] flex-shrink-0">
            <DashboardSideNav />
          </div>

          {/* Main content area */}
          <div className="flex-1 bg-[#f4f4f4] min-h-screen overflow-y-auto">
            {showTopNav && <DashboardTopNav />}
            <div className="p-4">{children}</div>
          </div>
        </div>
      </SidebarProvider>
    </SidebarTitleProvider>
  )
}

export default DashboardLayout





