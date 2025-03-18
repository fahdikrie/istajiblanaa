import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DUAA from "data/duaa.json";
import { highlightMatch, normalizeText } from "@/utils/string";
import { DuaPreviewCard } from "./dua-preview-card";

export const SearchableList = () => {
  const [query, setQuery] = useState("");

  // Contoh data
  const duaList: any[] = DUAA;

  // Mencari doa berdasarkan prioritas field
  const searchDua = (
    dua: any,
    query: string,
  ): { matches: boolean; matchField?: string } => {
    if (!query.trim()) return { matches: true };

    const normalizedQuery = normalizeText(query);
    if (normalizedQuery.length === 0) return { matches: true };

    // Prioritas 1: title_id
    if (normalizeText(dua.title.title_id).includes(normalizedQuery)) {
      return { matches: true, matchField: "title_id" };
    }

    // Prioritas 2: arabic
    if (normalizeText(dua.arabic).includes(normalizedQuery)) {
      return { matches: true, matchField: "arabic" };
    }

    // Prioritas 3: translation_id
    if (
      normalizeText(dua.translation.translation_id).includes(normalizedQuery)
    ) {
      return { matches: true, matchField: "translation_id" };
    }

    // Prioritas 4: transliteration
    if (normalizeText(dua.transliteration).includes(normalizedQuery)) {
      return { matches: true, matchField: "transliteration" };
    }

    // Prioritas 5: categories_id (cek semua kategori)
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
    <div className="max-w-2xl mx-auto p-4">
      <h1>Duaa</h1>

      <Input
        type="text"
        placeholder="Cari doa..."
        className="w-full mt-4 h-10 bg-white border rounded-md mb-4"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <div className="space-y-2">
        {filteredDuas.length > 0 ? (
          filteredDuas.map((dua) => (
            <DuaPreviewCard
              dua={dua}
              query={query}
              shownAttributes={["title", "source", "reference"]}
              classNames={{
                card: "py-3",
                header: "px-4 gap-0",
                content: "p-0",
              }}
            />
          ))
        ) : (
          <p className="text-gray-500 text-center p-8">Tidak ditemukan</p>
        )}
      </div>
    </div>
  );
};
