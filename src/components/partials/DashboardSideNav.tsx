"use client"

import React from "react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../ui/sidebar"
import Logo from "../shared/Logo"
import Image from "next/image"
import Link from "next/link"
import { sidebarNav } from "@/data"
import { usePathname } from "next/navigation"
import { useSidebarTitle } from "@/components/partials/SidebarTitleContext"
import { Bell, MoreVertical, User } from "lucide-react"

const DashboardSideNav = ({ ...props }: React.ComponentProps<typeof Sidebar>) => {
  const pathname = usePathname()
  const { setTitle } = useSidebarTitle()

  return (
    <Sidebar
      collapsible="icon"
      {...props}
      className="h-full w-[4rem] bg-white shadow-sm flex flex-col items-center justify-between"
    >
      {/* Header with Logo */}
      <SidebarHeader className="flex justify-center items-center mb-16">
        <Logo width={28} height={28} />
      </SidebarHeader>

      {/* Sidebar Menu (Icons Only) */}
      <SidebarContent className="flex-1 flex flex-col items-center justify-start">
        <SidebarGroup className="w-full">
          <SidebarMenu className="space-y-4 flex flex-col items-center">
            {sidebarNav.map((item, index) => {
              const isActive = pathname === item.url
              const isFirst = index === 0

              return (
                <Link
                  key={item.title}
                  href={item.url}
                  onClick={() => setTitle(item.title)}
                  className="flex justify-center"
                >
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      className={`cursor-pointer w-9 h-9 flex items-center justify-center rounded-lg transition-all hover:bg-[#f4f4f4] ${
                        isActive ? "bg-[#f4f4f4] shadow-sm" : ""
                      }`}
                    >
                      {isFirst ? (
                        <User size={20} color={isActive ? "#FF0000" : "#331400"} />
                      ) : (
                        item.icon && (
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
                        )
                      )}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </Link>
              )
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer Icons — Notification, Menu, Signout */}
      <SidebarFooter className="pb-6 w-full flex flex-col items-center space-y-3">
        <button className="p-2 rounded-lg hover:bg-[#f4f4f4]">
          <Bell size={18} color="#331400" />
        </button>
        <button className="p-2 rounded-lg hover:bg-[#f4f4f4]">
          <MoreVertical size={18} color="#331400" />
        </button>
        <button className="p-2 rounded-lg hover:bg-[#f4f4f4]">
          <Image
            src="/assets/icons/dashboard/signout.svg"
            alt="Signout Icon"
            width={18}
            height={18}
            style={{
              filter:
                "invert(14%) sepia(15%) saturate(2076%) hue-rotate(347deg) brightness(94%) contrast(87%)",
            }}
          />
        </button>
      </SidebarFooter>
    </Sidebar>
  )
}

export default DashboardSideNav







