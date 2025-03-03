import { create } from "zustand";

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

interface MenuStore {
  menus: MenuItem[] | null;
  setMenus: (newMenus: MenuItem[]) => void;
}

const useMenuStore = create<MenuStore>((set) => ({
  menus: null,
  setMenus: (newMenus) => set(() => ({ menus: newMenus })),
}));

export default useMenuStore;
