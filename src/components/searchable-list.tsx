import { persistentAtom } from "@nanostores/persistent";
import { useStore } from "@nanostores/react";
import { ChevronLeftIcon, ChevronRightIcon, EyeIcon } from "lucide-react";
import { AnimatePresence, motion, usePresenceData } from "motion/react";
import { useState, type TouchEvent } from "react";
import { toast } from "sonner";

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { DuaPreviewCard } from "@/components/dua-preview-card";

import { useIsMobile } from "@/hooks/use-mobile";

import type { Dua } from "@/types/dua";
import { normalizeText, slugify } from "@/utils/string";

export interface SearchableListProps {
  duas: Dua[];
}

const SHOWN_ATTRIBUTES_OPTIONS: { key: keyof Dua; label: string }[] = [
  { key: "id", label: "Nomor" },
  { key: "title", label: "Judul" },
  { key: "arabic", label: "Teks Bahasa Arab" },
  { key: "transliteration", label: "Transliterasi" },
  { key: "translation", label: "Terjemahan" },
  { key: "categories", label: "Kategori" },
  { key: "source", label: "Sumber" },
  { key: "reference", label: "Referensi" },
  { key: "occasion", label: "Kondisi/Sebab" },
  { key: "benefits", label: "Manfaat" },
  { key: "note", label: "Keterangan" },
];

const ITEMS_PER_PAGE = 10;

const PageContent = ({
  items,
  query,
  shownAttributes,
  direction,
}: {
  items: Dua[];
  query: string;
  shownAttributes: Array<keyof Dua>;
  direction: number;
}) => {
  const presenceDirection = usePresenceData();

  const animationDirection =
    presenceDirection !== undefined ? presenceDirection : direction;

  return (
    <motion.div
      className="space-y-4 dark:space-y-6 w-full"
      initial={{ opacity: 0, x: animationDirection * 50 }}
      animate={{
        opacity: 1,
        x: 0,
        transition: {
          type: "spring",
          stiffness: 300,
          damping: 30,
          duration: 0.3,
        },
      }}
      exit={{
        opacity: 0,
        x: animationDirection * -50,
        transition: {
          duration: 0.2,
        },
      }}
    >
      {items.length > 0 ? (
        items.map((dua, index) => (
          <DuaPreviewCard
            id={slugify(dua.title.title_id)}
            key={`${dua.title.title_id}-${index}`}
            dua={dua}
            query={query}
            shownAttributes={shownAttributes}
            className="py-3"
          />
        ))
      ) : (
        <p className="text-gray-500 text-center p-8">Tidak ditemukan</p>
      )}
    </motion.div>
  );
};

export const SearchableList = ({ duas }: SearchableListProps) => {
  const [query, setQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const isMobile = useIsMobile();
  const [direction, setDirection] = useState(1);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const minSwipeDistance = 75;

  const shownAttributesAtom = persistentAtom<Array<keyof Dua>>(
    "shownAttributes",
    ["id", "title", "source", "reference"],
    {
      encode: JSON.stringify,
      decode: JSON.parse,
    },
  );

  const shownAttributes = useStore(shownAttributesAtom);

  const searchDua = (
    dua: Dua,
    query: string,
  ): { matches: boolean; matchField?: string } => {
    if (!query.trim()) return { matches: true };

    const normalizedQuery = normalizeText(query);
    if (normalizedQuery.length === 0) return { matches: true };

    if (normalizeText(dua.title.title_id).includes(normalizedQuery)) {
      return { matches: true, matchField: "title_id" };
    }

    if (normalizeText(dua.arabic).includes(normalizedQuery)) {
      return { matches: true, matchField: "arabic" };
    }

    if (
      normalizeText(dua.translation.translation_id).includes(normalizedQuery)
    ) {
      return { matches: true, matchField: "translation_id" };
    }

    if (normalizeText(dua.transliteration).includes(normalizedQuery)) {
      return { matches: true, matchField: "transliteration" };
    }

    if (
      dua.categories.categories_id.some((cat: string | null | undefined) =>
        normalizeText(cat).includes(normalizedQuery),
      )
    ) {
      return { matches: true, matchField: "categories_id" };
    }

    return { matches: false };
  };

  const filteredDuas =
    query === ""
      ? duas
      : duas.filter((dua) => {
          return searchDua(dua, query).matches;
        });

  const totalItems = filteredDuas.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setCurrentPage(1);
  };

  const getCurrentPageItems = () => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredDuas.slice(startIndex, endIndex);
  };

  const paginatedItems = getCurrentPageItems();

  const goToPrevPage = () => {
    if (currentPage > 1) {
      setDirection(-1);
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setDirection(1);
      setCurrentPage(currentPage + 1);
    }
  };

  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push("ellipsis");
        pageNumbers.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pageNumbers.push(1);
        pageNumbers.push("ellipsis");
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        pageNumbers.push(1);
        pageNumbers.push("ellipsis");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push("ellipsis");
        pageNumbers.push(totalPages);
      }
    }

    return pageNumbers;
  };

  // Touch handlers for swipe
  const onTouchStart = (e: TouchEvent<HTMLDivElement>) => {
    if (!isMobile) return;
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: TouchEvent<HTMLDivElement>) => {
    if (!isMobile) return;
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!isMobile) return;
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && currentPage < totalPages) {
      goToNextPage();
    } else if (isRightSwipe && currentPage > 1) {
      goToPrevPage();
    }
  };

  return (
    <>
      <div className="w-full flex items-center gap-x-1">
        <Input
          type="text"
          placeholder="Cari doa..."
          className="flex-1 h-10 bg-white dark:bg-white dark:text-black border rounded-md shadow-2xs"
          value={query}
          onChange={handleQueryChange}
        />
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger className="w-10 h-10 bg-white flex items-center justify-center rounded-md border shadow-2xs">
            <EyeIcon className="text-gray-400 w-5 h-5" />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-60">
            <DropdownMenuLabel className="text-gray-500 dark:text-zinc-300">
              Atur tampilan doa
            </DropdownMenuLabel>
            {SHOWN_ATTRIBUTES_OPTIONS.map(({ key, label }, index) => (
              <DropdownMenuCheckboxItem
                key={`key-${index}`}
                checked={shownAttributes.includes(key)}
                onSelect={(e) => e.preventDefault()}
                onCheckedChange={(checked) => {
                  if (shownAttributes.length === 1 && checked === false) {
                    toast("Pilih minimal satu atribut");
                    return;
                  }

                  shownAttributesAtom.set(
                    checked
                      ? [...shownAttributes, key]
                      : shownAttributes.filter((attr) => attr !== key),
                  );
                }}
              >
                {label}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Top section with mini pagination */}
      <div className="flex items-center justify-between mt-6">
        <p className="text-xs text-gray-500 dark:text-zinc-400">
          Menampilkan {paginatedItems.length} dari {filteredDuas.length} Doa
        </p>

        {totalPages > 1 && (
          <div className="flex items-center text-xs gap-2">
            <motion.span
              className={`cursor-pointer underline ${currentPage === 1 ? "text-gray-300 dark:text-gray-600" : "text-gray-500 dark:text-zinc-400 hover:text-gray-700 dark:hover:text-zinc-200"}`}
              onClick={goToPrevPage}
              whileTap={{ scale: 0.9 }}
            >
              Prev
            </motion.span>

            <span className="text-gray-700 dark:text-zinc-300">
              {currentPage} / {totalPages}
            </span>

            <motion.span
              className={`cursor-pointer underline ${currentPage === totalPages ? "text-gray-300 dark:text-gray-600" : "text-gray-500 dark:text-zinc-400 hover:text-gray-700 dark:hover:text-zinc-200"}`}
              onClick={goToNextPage}
              whileTap={{ scale: 0.9 }}
            >
              Next
            </motion.span>
          </div>
        )}
      </div>

      {/* Content list with swipe functionality */}
      <div
        className="mt-4 relative overflow-hidden"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {isMobile && totalPages > 1 && (
          <div className="absolute top-1/2 left-0 w-full flex justify-between items-center z-10 pointer-events-none px-2">
            {currentPage > 1 && (
              <motion.div
                className="bg-gray-100/60 dark:bg-gray-800/60 p-2 rounded-full"
                initial={{ opacity: 0 }}
                animate={{
                  opacity:
                    touchStart && touchEnd && touchStart - touchEnd < -20
                      ? 0.7
                      : 0,
                }}
              >
                <ChevronLeftIcon className="w-6 h-6 text-gray-800 dark:text-gray-200" />
              </motion.div>
            )}

            {currentPage < totalPages && (
              <motion.div
                className="bg-gray-100/60 dark:bg-gray-800/60 p-2 rounded-full ml-auto"
                initial={{ opacity: 0 }}
                animate={{
                  opacity:
                    touchStart && touchEnd && touchStart - touchEnd > 20
                      ? 0.7
                      : 0,
                }}
              >
                <ChevronRightIcon className="w-6 h-6 text-gray-800 dark:text-gray-200" />
              </motion.div>
            )}
          </div>
        )}

        <AnimatePresence initial={false} mode="wait" custom={direction}>
          <PageContent
            key={currentPage}
            items={paginatedItems}
            query={query}
            shownAttributes={shownAttributes}
            direction={direction}
          />
        </AnimatePresence>
      </div>

      {/* Swipe hint for mobile */}
      {isMobile && totalPages > 1 && (
        <div className="text-xs text-gray-400 text-center mt-4 mb-2">
          {currentPage < totalPages && currentPage > 1 ? (
            <span>Geser ke kiri/kanan untuk navigasi</span>
          ) : currentPage === 1 ? (
            <span>Geser ke kiri untuk lanjut</span>
          ) : (
            <span>Geser ke kanan untuk kembali</span>
          )}
        </div>
      )}

      {/* Bottom section with full pagination (shown on desktop) */}
      {totalPages > 1 && !isMobile && (
        <div className="mt-6 mb-10">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage > 1) {
                      setDirection(-1);
                      setCurrentPage(currentPage - 1);
                    }
                  }}
                  className={
                    currentPage === 1 ? "pointer-events-none opacity-50" : ""
                  }
                />
              </PaginationItem>

              {getPageNumbers().map((page, index) =>
                page === "ellipsis" ? (
                  <PaginationItem key={`ellipsis-${index}`}>
                    <PaginationEllipsis />
                  </PaginationItem>
                ) : (
                  <PaginationItem key={`page-${page}`}>
                    <PaginationLink
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setDirection((page as number) > currentPage ? 1 : -1);
                        setCurrentPage(page as number);
                      }}
                      isActive={currentPage === page}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ),
              )}

              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage < totalPages) {
                      setDirection(1);
                      setCurrentPage(currentPage + 1);
                    }
                  }}
                  className={
                    currentPage === totalPages
                      ? "pointer-events-none opacity-50"
                      : ""
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </>
  );
};
