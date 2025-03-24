import { useStore } from "@nanostores/react";
import { GalleryThumbnails, LayoutList } from "lucide-react"; // Import icons for the toggle
import { AnimatePresence } from "motion/react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { CarouselView } from "@/components/carousel-view"; // Import the new component
import { FullPagination } from "@/components/full-pagination";
import { ListContent } from "@/components/list-content";
import { MiniPagination } from "@/components/mini-pagination";
import { SearchInput } from "@/components/search-input";

import { usePagination } from "@/hooks/use-pagination";
import { useSearch } from "@/hooks/use-search";
import { useSwipe } from "@/hooks/use-swipe";

import { languageAtom, shownAttributesAtom } from "@/store/store";
import type { Dua } from "@/types/dua";

export interface SearchableListProps {
  duas: Dua[];
  enablePagination?: boolean;
  itemsPerPage?: number;
  searchPlaceholder?: string;
  showViewToggle?: boolean;
}

export const SearchableList = ({
  duas,
  enablePagination,
  itemsPerPage = 10,
  searchPlaceholder,
  showViewToggle,
}: SearchableListProps) => {
  const shownAttributes = useStore(shownAttributesAtom);
  const language = useStore(languageAtom);

  const [viewMode, setViewMode] = useState<"list" | "carousel">("list");

  // Search functionality
  const { query, filteredItems, handleQueryChange } = useSearch(duas, language);

  // Pagination logic
  const {
    currentPage,
    totalPages,
    paginatedItems,
    goToPrevPage,
    goToNextPage,
    goToPage,
    direction,
    setPage,
  } = usePagination(filteredItems, {
    itemsPerPage: enablePagination ? itemsPerPage : filteredItems.length,
  });

  // Swipe functionality for mobile
  const { onTouchStart, onTouchMove, onTouchEnd } = useSwipe({
    onSwipeLeft: () => currentPage < totalPages && goToNextPage(),
    onSwipeRight: () => currentPage > 1 && goToPrevPage(),
  });

  // Reset page when search query changes
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleQueryChange(e);
    setPage(1);
  };

  // Select items to display based on pagination setting
  const displayItems = enablePagination ? paginatedItems : filteredItems;

  return (
    <>
      <SearchInput
        query={query}
        onQueryChange={handleSearch}
        placeholder={searchPlaceholder}
      />

      {/* View toggle buttons */}
      {showViewToggle ? (
        <div className="mt-2 flex items-center justify-center gap-2 self-end">
          <Button
            variant={viewMode === "list" ? "default" : "outline"}
            className="size-10 w-24"
            onClick={() => setViewMode("list")}
            title="Tampilan Daftar"
          >
            <LayoutList className="size-4" />
          </Button>
          <Button
            variant={viewMode === "carousel" ? "default" : "outline"}
            className="size-10 w-24"
            onClick={() => setViewMode("carousel")}
            title="Tampilan Satu-Satu"
          >
            <GalleryThumbnails className="size-4" />
          </Button>
        </div>
      ) : null}

      {/* Top section with mini pagination */}
      <div className="flex items-center justify-between mt-6">
        <p className="text-xs text-gray-500 dark:text-zinc-400">
          Menampilkan {displayItems.length} dari {filteredItems.length} Doa
        </p>

        {enablePagination && viewMode === "list" && (
          <MiniPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPrevPage={goToPrevPage}
            onNextPage={goToNextPage}
          />
        )}
      </div>

      {/* Conditional rendering based on view mode */}
      {viewMode === "list" ? (
        // List view
        <div
          className="mt-4 relative overflow-hidden"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <AnimatePresence initial={false} mode="wait" custom={direction}>
            <ListContent
              key={enablePagination ? currentPage : "all-items"}
              items={displayItems}
              query={query}
              shownAttributes={shownAttributes}
              direction={direction}
            />
          </AnimatePresence>
        </div>
      ) : (
        // Carousel view
        <div className="mt-4">
          <CarouselView duas={filteredItems} query={query} />
        </div>
      )}

      {/* Bottom section with full pagination - only show in list mode */}
      {enablePagination && viewMode === "list" && totalPages > 1 && (
        <div className="mt-6 mb-10">
          <FullPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={goToPage}
            onPrevPage={goToPrevPage}
            onNextPage={goToNextPage}
          />
        </div>
      )}
    </>
  );
};
