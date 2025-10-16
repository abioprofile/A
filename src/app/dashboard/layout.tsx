'use client'

import DashboardSideNav from '@/components/partials/DashboardSideNav'
import DashboardTopNav from '@/components/partials/DashboardTopNav'
import { SidebarProvider } from '@/components/ui/sidebar'
import { SidebarTitleProvider } from '@/components/partials/SidebarTitleContext'
import React from 'react'

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarTitleProvider>
      <SidebarProvider className="flex">
        <DashboardSideNav />
        <div className="w-full bg-[#f4f4f4] flex-1">
          <DashboardTopNav />
          {children}
        </div>
      </SidebarProvider>
    </SidebarTitleProvider>
  )
}

export default DashboardLayout

