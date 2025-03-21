import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DUAA from "data/duaa.json";
import { highlightMatch, normalizeText } from "@/utils/string";
import { DuaPreviewCard } from "./dua-preview-card";

export const SearchableList = () => {
  const [query, setQuery] = useState("");

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
      <Input
        type="text"
        placeholder="Cari doa..."
        className="w-full h-10 bg-white dark:bg-white dark:text-black border rounded-md mb-4 shadow-2xs"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <div className="space-y-2">
        {filteredDuas.length > 0 ? (
          filteredDuas.map((dua) => (
            <DuaPreviewCard
              dua={dua}
              query={query}
              shownAttributes={["id", "title", "source", "reference"]}
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
