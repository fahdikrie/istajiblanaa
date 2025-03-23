import { AnimatePresence, motion } from "motion/react";
import { useEffect, useMemo, useState } from "react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

import { useIsMobile } from "@/hooks/use-mobile";

import type { Dua } from "@/types/dua";
import { slugify } from "@/utils/string";

import { SearchableList } from "./searchable-list";

export interface ListPageProps {
  category: string;
  duas: Dua[];
  isNested?: boolean;
}

const ListPage = ({ category, duas, isNested }: ListPageProps) => {
  const isMobile = useIsMobile();

  const [showFloatingButton, setShowFloatingButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 140) {
        setShowFloatingButton(true);
      } else {
        setShowFloatingButton(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const navItems = useMemo(() => {
    return duas.map((dua) => ({
      id: dua.id,
      title: dua.title.title_id,
      url: `#${slugify(dua.title.title_id)}`,
    }));
  }, []);

  return (
    <SidebarProvider className="min-h-[unset]">
      <AppSidebar navItems={navItems} isNested={isNested} />
      <SidebarInset className="overflow-hidden md:h-[calc(100svh-69px)]">
        <header className="flex h-16 shrink-0 items-center gap-2 border-b">
          <div className="w-full md:w-fit flex items-center justify-between md:justify-start flex-row-reverse md:flex-row gap-2 px-4">
            <SidebarTrigger className={isMobile ? "scale-x-[-1]" : ""} />
            <Separator
              orientation="vertical"
              className="mr-2 h-4 hidden md:block"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/">Beranda</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>{category}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <section className="p-4 overflow-auto">
          <div className="max-w-2xl mx-auto">
            <SearchableList duas={duas} />
          </div>
        </section>
      </SidebarInset>
      <AnimatePresence>
        {isMobile && showFloatingButton && (
          <motion.div
            className="fixed bottom-18 right-18 z-50"
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            <Button className="rounded-full w-14 h-14 fixed">
              <SidebarTrigger className="scale-x-[-1] [&>svg]:size-6!" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </SidebarProvider>
  );
};

export { ListPage };
