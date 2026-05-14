import { useStore } from "@nanostores/react";
import * as React from "react";
import { useEffect, useRef } from "react";

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
  useSidebar,
} from "@/components/ui/sidebar";

import { useIsMobile } from "@/hooks/use-mobile";

import { cn } from "@/lib/utils";
import { announcementBarAtom } from "@/store/store";

export interface NavItemBase {
  id: number;
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
  setCurrentIndex: React.Dispatch<React.SetStateAction<number>>;
  activeDuaId?: string | null;
  setActiveDuaId?: React.Dispatch<React.SetStateAction<string | null>>;
}

export const AppSidebar = ({
  navItems,
  isNested,
  setCurrentIndex,
  activeDuaId,
  setActiveDuaId,
  ...props
}: AppSidebarProps) => {
  const isMobile = useIsMobile();
  const announcementBar = useStore(announcementBarAtom);
  const { openMobile, setOpenMobile } = useSidebar();
  const itemRefs = useRef<Map<string, HTMLAnchorElement>>(new Map());
  const savedScrollTop = useRef(0);

  // Smooth scroll as active dua changes (scroll observer / carousel navigation)
  useEffect(() => {
    if (!activeDuaId) return;
    const el = itemRefs.current.get(`#${activeDuaId}`);
    el?.scrollIntoView({ block: "center", behavior: "smooth" });
  }, [activeDuaId]);

  // Save scroll position on close, restore it on reopen
  useEffect(() => {
    const content = document.querySelector<HTMLElement>('[data-sidebar="content"]');
    if (openMobile) {
      // Content just mounted — restore scroll position next tick
      const timer = setTimeout(() => {
        const el = document.querySelector<HTMLElement>('[data-sidebar="content"]');
        if (el) el.scrollTop = savedScrollTop.current;
      }, 0);
      return () => clearTimeout(timer);
    } else {
      if (content) savedScrollTop.current = content.scrollTop;
    }
  }, [openMobile]);

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
        className={cn(
          announcementBar?.isBannerVisible
            ? "h-[calc(100%-68px-36px)] top-[calc(69px+36px)]"
            : "h-[calc(100%-68px)] top-[69px]",
          "z-0",
        )}
      >
        <SidebarContent>
          <SidebarGroup className="p-0">
            <SidebarMenu className="flex flex-col gap-0">
              {navItems.map((item, index) => {
                const isActive = activeDuaId === item.url.slice(1);
                return (
                  <a
                    key={`${item.id}-${item.title}`}
                    href={item.url}
                    ref={(el) => {
                      if (el) itemRefs.current.set(item.url, el);
                      else itemRefs.current.delete(item.url);
                    }}
                    className={cn(
                      "text-sm font-light flex items-center justify-center p-2 border-b-1 gap-x-1 transition-colors duration-150",
                      isActive
                        ? "bg-accent border-l-2 border-l-primary pl-[7px] font-medium"
                        : "hover:bg-accent/50",
                    )}
                    onClick={() => {
                      setCurrentIndex(index);
                      setActiveDuaId?.(item.url.slice(1));
                      if (isMobile) setOpenMobile(false);
                    }}
                  >
                    <span
                      className={cn(
                        "w-[24px] text-center text-xs shrink-0",
                        isActive ? "text-primary font-semibold" : "text-gray-400",
                      )}
                    >
                      {item.id}.
                    </span>
                    <div className="flex-1 hover:underline line-clamp-2">
                      {item.title}
                    </div>
                  </a>
                );
              })}
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
