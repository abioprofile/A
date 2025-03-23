import DashboardSideNav from '@/components/partials/DashboardSideNav'
import DashboardTopNav from '@/components/partials/DashboardTopNav'
import { SidebarProvider } from '@/components/ui/sidebar'
import React from 'react'

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <SidebarProvider className="flex">
            <DashboardSideNav />
            <div className='w-full flex-1'>
                <DashboardTopNav />
                {children}
            </div>
        </SidebarProvider>
    )
}

export default DashboardLayout
