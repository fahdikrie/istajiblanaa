import { useState } from "react";

import type { Dua } from "@/types/dua";
import { normalizeText } from "@/utils/string";

export const useSearch = (duas: Dua[], language: "id" | "en") => {
  const [query, setQuery] = useState("");

  const searchDua = (
    dua: Dua,
    query: string,
  ): { matches: boolean; matchField?: string } => {
    if (!query.trim()) return { matches: true };

    const title = language === "id" ? dua.title.title_id : dua.title.title_en;
    const translation =
      language === "id"
        ? dua.translation.translation_id
        : dua.translation.translation_en;
    const categories =
      language === "id"
        ? dua.categories.categories_id
        : dua.categories.categories_en;

    const normalizedQuery = normalizeText(query);
    if (normalizedQuery.length === 0) return { matches: true };

    if (normalizeText(title).includes(normalizedQuery)) {
      return { matches: true, matchField: "title" };
    }

    if (normalizeText(dua.arabic).includes(normalizedQuery)) {
      return { matches: true, matchField: "arabic" };
    }

    if (normalizeText(translation).includes(normalizedQuery)) {
      return { matches: true, matchField: "translation" };
    }

    if (normalizeText(dua.transliteration).includes(normalizedQuery)) {
      return { matches: true, matchField: "transliteration" };
    }

    if (
      categories.some((cat: string | null | undefined) =>
        normalizeText(cat).includes(normalizedQuery),
      )
    ) {
      return { matches: true, matchField: "categories" };
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
