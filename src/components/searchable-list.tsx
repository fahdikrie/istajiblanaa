import { useStore } from "@nanostores/react";
import { AnimatePresence } from "motion/react";

import { FullPagination } from "@/components/full-pagination";
import { ListContent } from "@/components/list-content";
import { MiniPagination } from "@/components/mini-pagination";
import { SearchInput } from "@/components/search-input";

import { useIsMobile } from "@/hooks/use-mobile";
import { usePagination } from "@/hooks/use-pagination";
import { useSearch } from "@/hooks/use-search";
import { useSwipe } from "@/hooks/use-swipe";

import { shownAttributesAtom } from "@/store/store";
import type { Dua } from "@/types/dua";

export interface SearchableListProps {
  duas: Dua[];
  enablePagination?: boolean;
  itemsPerPage?: number;
  searchPlaceholder?: string;
}

export const SearchableList = ({
  duas,
  enablePagination,
  itemsPerPage = 10,
  searchPlaceholder,
}: SearchableListProps) => {
  const shownAttributes = useStore(shownAttributesAtom);

  // Search functionality
  const { query, filteredItems, handleQueryChange } = useSearch(duas);

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

      {/* Top section with mini pagination */}
      <div className="flex items-center justify-between mt-6">
        <p className="text-xs text-gray-500 dark:text-zinc-400">
          Menampilkan {displayItems.length} dari {filteredItems.length} Doa
        </p>

        {enablePagination && (
          <MiniPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPrevPage={goToPrevPage}
            onNextPage={goToNextPage}
          />
        )}
      </div>

      {/* Content list with swipe functionality */}
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

      {/* Bottom section with full pagination */}
      {enablePagination && totalPages > 1 && (
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
