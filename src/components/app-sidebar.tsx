import * as React from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@/components/ui/sidebar";

import { useIsMobile } from "@/hooks/use-mobile";

// Define the types for our navigation items
export interface NavItemBase {
  id?: number;
  title: string;
  url: string;
  isActive?: boolean;
}

export interface NavItemNested extends NavItemBase {
  items?: NavItemBase[];
}

export type NavItem = NavItemBase | NavItemNested;

export interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  navItems: NavItem[];
  isNested?: boolean;
}

export const AppSidebar = ({
  navItems,
  isNested,
  ...props
}: AppSidebarProps) => {
  const isMobile = useIsMobile();

  const hasNestedItems = (item: NavItem): item is NavItemNested => {
    return (
      "items" in item && Array.isArray(item.items) && item.items.length > 0
    );
  };

  if (!isNested) {
    return (
      <Sidebar
        {...props}
        side={isMobile ? "right" : "left"}
        className="h-[calc(100%-68px)] top-[69px] z-0"
      >
        <SidebarContent>
          <SidebarGroup className="p-0">
            <SidebarMenu className="flex flex-col gap-0">
              {navItems.map((item, index) => (
                <a
                  key={`${item.id}-${item.title}`}
                  href={item.url}
                  className="text-sm font-light flex items-center justify-center p-2 border-b-1 gap-x-1"
                >
                  <span className="w-[24px] text-center text-gray-400 text-xs">
                    {index + 1}.
                  </span>
                  <div className="flex-1">{item.title}</div>
                </a>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
        <SidebarRail />
      </Sidebar>
    );
  }

  return (
    <Sidebar {...props} className="h-[calc(100%-68px)] top-[69px]">
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild>
                  <a href={item.url} className="font-medium">
                    {item.title}
                  </a>
                </SidebarMenuButton>
                {hasNestedItems(item) && (
                  <SidebarMenuSub>
                    {item?.items?.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.title}>
                        <SidebarMenuSubButton asChild>
                          <a href={subItem.url}>{subItem.title}</a>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                )}
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
};
