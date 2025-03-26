import { useStore } from "@nanostores/react";
import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState } from "react";

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

import { useHasScrolledPastAnchor } from "@/hooks/use-has-scrolled-past-anchor";
import { useIsMobile } from "@/hooks/use-mobile";

import { cn } from "@/lib/utils";
import { announcementBarAtom, languageAtom } from "@/store/store";
import type { Dua } from "@/types/dua";
import { slugify } from "@/utils/string";

import { SearchableList } from "./searchable-list";

export interface ListPageProps {
  category: string;
  duas: Dua[];
  isNested?: boolean;
}

const ListPage = ({ category, duas, isNested }: ListPageProps) => {
  // For carousel view
  const [currentIndex, setCurrentIndex] = useState(0);

  const isMobile = useIsMobile();
  const language = useStore(languageAtom);
  const eventBanner = useStore(announcementBarAtom);

  const hasScrolledPastAnchor = useHasScrolledPastAnchor(140);

  const navItems = useMemo(() => {
    const generateTitle = (dua: Dua) =>
      language === "id" ? dua.title.title_id : dua.title.title_en;

    return duas
      .map((dua) => {
        if (!dua.id) return;

        return {
          id: dua.id,
          title: generateTitle(dua),
          url: `#${slugify(generateTitle(dua))}`,
        };
      })
      .filter((dua) => !!dua);
  }, [language]);

  return (
    <SidebarProvider className="min-h-[unset]">
      <AppSidebar
        navItems={navItems}
        isNested={isNested}
        setCurrentIndex={setCurrentIndex}
      />
      <SidebarInset
        className={cn(
          "overflow-hidden",
          eventBanner?.isBannerVisible
            ? "md:h-[calc(100svh-69px-36px)]"
            : "md:h-[calc(100svh-69px)]",
        )}
      >
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
            <SearchableList
              duas={duas}
              currentIndex={currentIndex}
              setCurrentIndex={setCurrentIndex}
              showViewToggle
            />
          </div>
        </section>
      </SidebarInset>
      <AnimatePresence>
        {isMobile && hasScrolledPastAnchor && (
          <motion.div
            className="fixed bottom-18 right-18 z-50"
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="rounded-full w-14 h-14 fixed flex items-center justify-center bg-accent">
              <SidebarTrigger className="scale-x-[-1] [&>svg]:size-6!" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </SidebarProvider>
  );
};

export { ListPage };
