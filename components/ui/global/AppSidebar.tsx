"use client"

import * as React from "react"
import {
  Building2,
  Car,
  Ellipsis,
  Handshake,
  LayoutDashboard,
  MousePointerClick,
  Shapes,
  SlidersHorizontal,
  User2,
} from "lucide-react"

import { NavMain } from "@/components/ui/global/NavMain"
import { BrandSwitcher } from "@/components/ui/global/BrandSwitcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import SidebarLogout from "./SidebarLogout"


const data = {
  user: {
    name: "outperform",
    email: "ashir.arif@outperform",
    avatar: "/images/dashboard/avatar.jpg",
  },
  brand: [
    {
      name: "Jubilee",
      logo: "/images/common/logo.png",
    },
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "/",
      icon: LayoutDashboard,
    },
    {
      title: "Users",
      url: "/users",
      icon: User2,
    },
    {
      title: "Cars",
      url: "/cars",
      icon: Car,
    },
    {
      title: "Aftermarket Accessories",
      url: "/aftermarket-accessories",
      icon: SlidersHorizontal,
    },
    {
      title: "Company",
      url: "#",
      icon: Building2,
    },
    {
      title: "Models",
      url: "/units",
      icon: MousePointerClick,
    },
    {
      title: "Standard Features",
      url: "/samples",
      icon: Handshake,
    },
    {
      title: "Installed Options",
      url: "#",
      icon: Ellipsis,
    },
    {
      title: "Popular Features",
      url: "/popular-features",
      icon: Shapes,
    },
    // {
    //   title: "Report Data Fields",
    //   url: "#",
    //   icon: RectangleEllipsis,
    //   items: [
    //     {
    //       title: "Customer Reference",
    //       url: "#",
    //     },
    //     {
    //       title: "Machine",
    //       url: "#",
    //     },
    //     {
    //       title: "Machine Make & Type",
    //       url: "#",
    //     },
    //     {
    //       title: "Part",
    //       url: "#",
    //     },
    //     {
    //       title: "Part Make & Type",
    //       url: "#",
    //     },
    //     {
    //       title: "Sample No",
    //       url: "#",
    //     },
    //     {
    //       title: "Report Date",
    //       url: "#",
    //     },
    //   ],
    // },
  ]
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon"  {...props}>
      <SidebarHeader className="border-b">
        <BrandSwitcher brand={data.brand} />
      </SidebarHeader>
      <SidebarContent>
        {/* <NavProjects projects={data.projects} /> */}
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter className="border-t">
        <SidebarLogout />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
