"use client"

import React from 'react'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '../ui/sidebar'
import Logo from '../shared/Logo'
import { Button } from '../ui/button'
import Image from 'next/image'
import Link from 'next/link'
import { sidebarNav } from '@/data'
import { usePathname } from 'next/navigation'
import { Separator } from '../ui/separator'
import { useSidebarTitle } from '@/components/partials/SidebarTitleContext'

const DashboardSideNav = ({ ...props }: React.ComponentProps<typeof Sidebar>) => {
  const pathname = usePathname()
  const { setTitle } = useSidebarTitle();
  return (
    <Sidebar collapsible="icon" {...props} className="w-[14rem]">
      <SidebarHeader className="px-10">
        <Logo width={9} height={9} showText />
      </SidebarHeader>
      <Separator />
      <SidebarContent className="w-full">
        <SidebarGroup className="p-0">
          <SidebarMenu className="space-y-2 w-full mx-auto md:pt-20">
            {sidebarNav.map((item) => {
              const isActive = pathname === item.url
              return (
                <Link key={item.title} href={item.url} onClick={() => setTitle(item.title)}>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      className={`rounded-none cursor-pointer pl-10 w-full h-8 flex items-center gap-2 hover:bg-[#f4f4f4] ${
                        isActive ? 'bg-[#f4f4f4]' : ''
                      }`}
                    >
                      {item.icon && (
                        <Image
                          src={item.icon}
                          alt={`${item.title} Icon`}
                          width={20}
                          height={20}
                          className={`${
                            isActive ? 'filter-purple' : 'filter-gray'
                          }`}
                        />
                      )}
                      <span
                        className={`${
                          isActive
                            ? 'text-[#7140eb] font-bold'
                            : 'text-black font-bold'
                        }`}
                      >
                        {item.title}
                      </span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </Link>
              )
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="mb-5">
        <SidebarContent className="mx-auto">
          <Button
            variant="outline"
            className="flex items-center gap-1 border-1 border-[#9F9F9F] max-w-[8rem] max-h-9"
          >
            <Image
              src="/assets/icons/dashboard/signout.svg"
              alt="Signout Icon"
              width={15}
              height={15}
            />
            Signout
          </Button>
        </SidebarContent>
      </SidebarFooter>
    </Sidebar>
  )
}

export default DashboardSideNav


