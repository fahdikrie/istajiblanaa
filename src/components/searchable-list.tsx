import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DUAA from "data/duaa.json";
import { highlightMatch, normalizeText } from "@/utils/string";
import { DuaPreviewCard } from "./dua-preview-card";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "./ui/button";
import { EyeIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import type { Dua } from "@/types/dua";
import { toast } from "sonner";
import { persistentAtom } from "@nanostores/persistent";
import { useStore } from "@nanostores/react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

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

export const SearchableList = () => {
  const [query, setQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const shownAttributesAtom = persistentAtom<Array<keyof Dua>>(
    "shownAttributes",
    ["id", "title", "source", "reference"],
    {
      encode: JSON.stringify,
      decode: JSON.parse,
    },
  );

  const shownAttributes = useStore(shownAttributesAtom);

  const duaList: any[] = DUAA;

  const searchDua = (
    dua: any,
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
      ? duaList
      : duaList.filter((dua) => {
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
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
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
            <span
              className={`cursor-pointer ${currentPage === 1 ? "text-gray-300 dark:text-gray-600" : "text-gray-500 dark:text-zinc-400 hover:text-gray-700 dark:hover:text-zinc-200"}`}
              onClick={goToPrevPage}
            >
              <ChevronLeftIcon className="w-4 h-4 inline" />
            </span>

            <span className="text-gray-700 dark:text-zinc-300">
              {currentPage} / {totalPages}
            </span>

            <span
              className={`cursor-pointer ${currentPage === totalPages ? "text-gray-300 dark:text-gray-600" : "text-gray-500 dark:text-zinc-400 hover:text-gray-700 dark:hover:text-zinc-200"}`}
              onClick={goToNextPage}
            >
              <ChevronRightIcon className="w-4 h-4 inline" />
            </span>
          </div>
        )}
      </div>

      {/* Content list */}
      <div className="space-y-4 dark:space-y-6 mt-4">
        {filteredDuas.length > 0 ? (
          paginatedItems.map((dua, index) => (
            <DuaPreviewCard
              key={`${dua.title.title_id}-${index}`}
              dua={dua}
              query={query}
              shownAttributes={shownAttributes}
              classNames={{
                card: "py-3",
                header: "px-0 gap-0",
                content: "p-0",
              }}
            />
          ))
        ) : (
          <p className="text-gray-500 text-center p-8">Tidak ditemukan</p>
        )}
      </div>

      {/* Bottom section with full pagination */}
      {totalPages > 1 && (
        <div className="mt-6 mb-10">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage > 1) setCurrentPage(currentPage - 1);
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
                    if (currentPage < totalPages)
                      setCurrentPage(currentPage + 1);
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
