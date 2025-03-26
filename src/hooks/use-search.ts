import { useStore } from "@nanostores/react";
import { useState } from "react";

import { searchFieldsAtom } from "@/store/store";
import type { Dua } from "@/types/dua";
import { normalizeText } from "@/utils/string";

export const useSearch = (duas: Dua[], language: "id" | "en") => {
  const [query, setQuery] = useState("");
  const searchFields = useStore(searchFieldsAtom);

  const searchDua = (
    dua: Dua,
    query: string,
  ): { matches: boolean; matchField?: string } => {
    if (!query.trim()) return { matches: true };

    const normalizedQuery = normalizeText(query);
    if (normalizedQuery.length === 0) return { matches: true };

    if (searchFields.includes("title")) {
      const title = language === "id" ? dua.title.title_id : dua.title.title_en;
      if (normalizeText(title).includes(normalizedQuery)) {
        return { matches: true, matchField: "title" };
      }
    }

    if (searchFields.includes("arabic")) {
      if (normalizeText(dua.arabic).includes(normalizedQuery)) {
        return { matches: true, matchField: "arabic" };
      }
    }

    if (searchFields.includes("translation")) {
      const translation =
        language === "id"
          ? dua.translation.translation_id
          : dua.translation.translation_en;
      if (normalizeText(translation).includes(normalizedQuery)) {
        return { matches: true, matchField: "translation" };
      }
    }

    if (searchFields.includes("transliteration")) {
      if (normalizeText(dua.transliteration).includes(normalizedQuery)) {
        return { matches: true, matchField: "transliteration" };
      }
    }

    if (searchFields.includes("categories")) {
      const categories =
        language === "id"
          ? dua.categories.categories_id
          : dua.categories.categories_en;
      if (
        categories.some((cat: string | null | undefined) =>
          normalizeText(cat).includes(normalizedQuery),
        )
      ) {
        return { matches: true, matchField: "categories" };
      }
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
