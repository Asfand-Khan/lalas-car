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

const getPageRights = (url: string): MenuItem | null => {
  console.log("Get page rights function");
  const menus = JSON.parse(getCookie("menus")?.toString() || "[]") as MenuItem[];
  const menu = menus.find((item: any) => item.url === url);
  return menu as MenuItem;
};

export default getPageRights;
