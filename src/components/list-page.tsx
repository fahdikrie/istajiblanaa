import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import type { Dua } from "@/types/dua";
import { useMemo } from "react";
import { slugify } from "@/utils/string";

export interface ListPageProps {
  category: string;
  duas: Dua[];
  isNested?: boolean;
}

const ListPage = ({ category, duas, isNested }: ListPageProps) => {
  const navItems = useMemo(() => {
    return duas.map((dua) => ({
      title: dua.title.title_id,
      url: `#${slugify(dua.title.title_id)}`,
    }));
  }, []);

  return (
    <SidebarProvider className="min-h-[unset]">
      <AppSidebar navItems={navItems} isNested={isNested} />
      <SidebarInset className="overflow-hidden md:h-[calc(100svh-69px)]">
        <header className="flex h-16 shrink-0 items-center gap-2 border-b">
          <div className="flex items-center gap-2 px-3">
            <SidebarTrigger />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/">Home</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>{category}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
      </SidebarInset>
    </SidebarProvider>
  );
};

export { ListPage };
