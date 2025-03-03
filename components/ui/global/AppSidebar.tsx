"use client";

import * as React from "react";
import * as Icons from "lucide-react";

import { NavMain } from "@/components/ui/global/NavMain";
import { BrandSwitcher } from "@/components/ui/global/BrandSwitcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import SidebarLogout from "./SidebarLogout";
import useMenuStore from "@/hooks/useMenuStore";
import { getCookie } from "cookies-next";

interface MenuItem {
  can_create: boolean;
  can_delete: boolean;
  can_edit: boolean;
  can_view: boolean;
  icon: null | string;
  menu_id: number;
  menu_name: string;
  parent_id: null | number;
  sorting: null | number;
  url: string;
}

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
  // navMain: [
  //   {
  //     title: "Dashboard",
  //     url: "/",
  //     icon: LayoutDashboard,
  //   },
  //   {
  //     title: "Users",
  //     url: "/users",
  //     icon: User2,
  //   },
  //   {
  //     title: "Cars",
  //     url: "/cars",
  //     icon: Car,
  //   },
  //   {
  //     title: "Aftermarket Accessories",
  //     url: "/aftermarket-accessories",
  //     icon: SlidersHorizontal,
  //   },
  //   {
  //     title: "Company",
  //     url: "/companies",
  //     icon: Building2,
  //   },
  //   {
  //     title: "Models",
  //     url: "/models",
  //     icon: MousePointerClick,
  //   },
  //   {
  //     title: "Standard Features",
  //     url: "/standard-features",
  //     icon: Handshake,
  //   },
  //   {
  //     title: "Installed Options",
  //     url: "/installed-options",
  //     icon: Ellipsis,
  //   },
  //   {
  //     title: "Popular Features",
  //     url: "/popular-features",
  //     icon: Shapes,
  //   },
  //   // {
  //   //   title: "Report Data Fields",
  //   //   url: "#",
  //   //   icon: RectangleEllipsis,
  //   //   items: [
  //   //     {
  //   //       title: "Customer Reference",
  //   //       url: "#",
  //   //     },
  //   //     {
  //   //       title: "Machine",
  //   //       url: "#",
  //   //     },
  //   //     {
  //   //       title: "Machine Make & Type",
  //   //       url: "#",
  //   //     },
  //   //     {
  //   //       title: "Part",
  //   //       url: "#",
  //   //     },
  //   //     {
  //   //       title: "Part Make & Type",
  //   //       url: "#",
  //   //     },
  //   //     {
  //   //       title: "Sample No",
  //   //       url: "#",
  //   //     },
  //   //     {
  //   //       title: "Report Date",
  //   //       url: "#",
  //   //     },
  //   //   ],
  //   // },
  // ]
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { setMenus } = useMenuStore();

  const menusFromCookie: MenuItem[] = React.useMemo(() => {
    return JSON.parse(getCookie("menus")?.toString() || "[]");
  }, []);

  const [menu, setMenu] = React.useState<
    {
      menu_id: number;
      title: string;
      url: string;
      icon: React.ComponentType | null;
      items?: {
        menu_id: number;
        title: string;
        url: string;
      }[];
    }[]
  >([]);

  const makeMenu = React.useCallback(() => {
    if (!menusFromCookie.length) return;

    const menuMap: { [key: number]: any } = {};

    menusFromCookie.forEach((menu) => {
      const IconComponent =
        menu.icon && Icons[menu.icon as keyof typeof Icons]
          ? Icons[menu.icon as keyof typeof Icons]
          : null;

      menuMap[menu.menu_id] = {
        menu_id: menu.menu_id,
        title: menu.menu_name,
        url: `/${menu.url}`,
        icon: IconComponent,
        items: [],
      };
    });

    menusFromCookie.forEach((menu) => {
      if (menu.parent_id) {
        if (menuMap[menu.parent_id]) {
          menuMap[menu.parent_id].items.push(menuMap[menu.menu_id]);
        }
      }
    });

    const structuredMenus = Object.values(menuMap).filter(
      (menu: any) =>
        !menusFromCookie.find((item) => item.menu_id === menu.menu_id)
          ?.parent_id
    );

    console.log(structuredMenus);
    setMenu(structuredMenus);
    setMenus(menusFromCookie);
  }, [menusFromCookie, setMenus]);

  React.useEffect(() => {
    makeMenu();
  }, [makeMenu]);

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="border-b">
        <BrandSwitcher brand={data.brand} />
      </SidebarHeader>
      <SidebarContent>
        {/* <NavProjects projects={data.projects} /> */}
        <NavMain items={menu} />
      </SidebarContent>
      <SidebarFooter className="border-t">
        <SidebarLogout />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
