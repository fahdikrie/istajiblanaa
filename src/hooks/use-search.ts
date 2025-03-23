// hooks/use-search.ts
import { useState } from "react";

import type { Dua } from "@/types/dua";
import { normalizeText } from "@/utils/string";

export const useSearch = (duas: Dua[]) => {
  const [query, setQuery] = useState("");

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

  const filteredItems =
    query === "" ? duas : duas.filter((dua) => searchDua(dua, query).matches);

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  return {
    query,
    setQuery,
    filteredItems,
    handleQueryChange,
  };
};
