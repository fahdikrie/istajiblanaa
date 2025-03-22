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
import { EyeIcon } from "lucide-react";
import type { Dua } from "@/types/dua";
import { toast } from "sonner";

const SHOWN_ATTRIBUTES_OPTIONS: { key: keyof Dua; label: string }[] = [
  { key: "id", label: "Nomor" },
  { key: "title", label: "Judul" },
  { key: "arabic", label: "Text Arab" },
  { key: "transliteration", label: "Transliterasi" },
  { key: "categories", label: "Kategori" },
  { key: "source", label: "Sumber" },
  { key: "reference", label: "Referensi" },
  { key: "occasion", label: "Kondisi/Sebab" },
  { key: "benefits", label: "Manfaat" },
  { key: "note", label: "Keterangan" },
];

export const SearchableList = () => {
  const [query, setQuery] = useState("");
  const [shownAttributes, setShownAttributes] = useState<Array<keyof Dua>>([
    "id",
    "title",
    "source",
    "reference",
  ]);

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

  return (
    <>
      <div className="w-full flex items-center gap-x-1">
        <Input
          type="text"
          placeholder="Cari doa..."
          className="flex-1 h-10 bg-white dark:bg-white dark:text-black border rounded-md shadow-2xs  "
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger className="w-10 h-10 bg-white flex items-center justify-center rounded-md border shadow-2xs  ">
            <EyeIcon className="text-gray-400 w-5 h-5" />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-40">
            <DropdownMenuLabel className="text-gray-500">
              Atur tampilan doa
            </DropdownMenuLabel>
            {SHOWN_ATTRIBUTES_OPTIONS.map(({ key, label }) => (
              <DropdownMenuCheckboxItem
                key={key}
                checked={shownAttributes.includes(key)}
                onCheckedChange={(checked) => {
                  if (shownAttributes.length === 1) {
                    toast("Pilih minimal satu atribut");
                    return;
                  }

                  setShownAttributes((prev) =>
                    checked
                      ? [...prev, key]
                      : prev.filter((attr) => attr !== key),
                  );
                }}
              >
                {label}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="space-y-2 mt-4">
        {filteredDuas.length > 0 ? (
          filteredDuas.map((dua) => (
            <DuaPreviewCard
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
    </>
  );
};
