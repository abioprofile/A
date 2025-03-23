"use client"

import React from 'react'
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '../ui/sidebar'
import Logo from '../shared/Logo'
import { Button } from '../ui/button'
import Image from 'next/image'
import Link from 'next/link'
import { sidebarNav } from '@/data'
import { usePathname } from 'next/navigation'
import { Separator } from '../ui/separator'

const DashboardSideNav = ({ ...props }: React.ComponentProps<typeof Sidebar>) => {
    const pathname = usePathname()
    return (
        <Sidebar collapsible="icon" {...props} className='w-[14rem]'>
            <SidebarHeader className='px-10'>
                <Logo width={10} height={10} showText />
            </SidebarHeader>
            <Separator />
            <SidebarContent className='w-full'>
                <SidebarGroup className='p-0'>
                    <SidebarMenu className="space-y-2 w-full mx-auto md:pt-20">
                        {sidebarNav.map((item) => {
                            const isActive = pathname === item.url
                            return (
                                <Link key={item.title} href={item.url}>
                                    <SidebarMenuItem>
                                        <SidebarMenuButton className={`rounded-none cursor-pointer pl-10 w-full h-8 flex items-center hover:bg-stone-200 ${isActive ? "bg-[#F5F5F5]" : ""}`}>
                                            {item.icon && <Image
                                                src={item?.icon}
                                                alt={`${item.title} Icon`}
                                                width={20}
                                                height={20}
                                            />}
                                            <span className="text-gray-500">{item.title}</span>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                </Link>
                            )
                        }
                        )}
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter className='mb-5'>
                <SidebarContent className='mx-auto'>
                    <Button variant='outline' className='flex items-center gap-1 border-2 border-[#9F9F9F] max-w-[8rem] max-h-9'> <Image
                        src="/assets/icons/dashboard/signout.svg"
                        alt="Home Icon"
                        width={20}
                        height={20}
                    />Signout</Button>
                </SidebarContent>
            </SidebarFooter>
        </Sidebar>
    )
}

export default DashboardSideNav
