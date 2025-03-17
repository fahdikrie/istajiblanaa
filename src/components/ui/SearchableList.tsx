import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import DUAA from "data/duaa.json";

// Definisi tipe untuk data doa
// const dataDoa = {
//   id: null,
//   title: {
//     title_id: "",
//     title_en: "",
//   },
//   arabic: "",
//   arabic_first_person_plural: null,
//   translation: {
//     translation_id: "",
//     translation_en: "",
//   },
//   transliteration: "",
//   transliteration_first_person_plural: null,
//   categories: {
//     categories_id: [],
//     categories_en: [],
//   },
//   source: "",
//   reference: "",
//   occasion: {
//     occassion_id: "",
//     occassion_en: "",
//   },
//   benefits: null,
//   note: {
//     note_id: "",
//     note_en: "",
//   },
// };

export const SearchableList = () => {
  const [query, setQuery] = useState("");

  // Contoh data
  const duaList: any[] = DUAA;

  const normalizeText = (text: string | null | undefined): string => {
    if (!text) return "";

    return text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // Hapus aksen Latin (ā → a)
      .replace(/[\u064B-\u065F\u0670]/g, "") // Hapus harakat Arab (َ ُ ِ ّ ْ ـٰ)
      .replace(/[^a-z0-9\u0600-\u06FF]/g, "") // Hapus tanda baca, kecuali huruf Arab
      .replace(/\s+/g, ""); // Hilangkan semua spasi
  };

  const highlightMatch = (text: string | null | undefined, query: string) => {
    if (!text) return "";
    if (!query.trim()) return text;

    const normalizedText = normalizeText(text);
    const normalizedQuery = normalizeText(query);

    if (normalizedQuery.length === 0) return text;

    const index = normalizedText.indexOf(normalizedQuery);
    if (index === -1) return text;

    // Find the actual positions in the original text
    let startPos = 0;
    let currentPos = 0;

    // Find the start position in the original text that corresponds to the normalized index
    for (let i = 0; i < text.length && currentPos < index; i++) {
      // Skip harakat and other characters that are removed in normalization
      const char = text[i];
      if (normalizeText(char).length > 0) {
        currentPos++;
      }
      startPos++;
    }

    // Find the end position by counting normalized characters
    let endPos = startPos;
    let matchedChars = 0;

    while (endPos < text.length && matchedChars < normalizedQuery.length) {
      const normalChar = normalizeText(text[endPos]);
      if (normalChar.length > 0) {
        matchedChars++;
      }
      endPos++;
    }

    const beforeMatch = text.slice(0, startPos);
    const match = text.slice(startPos, endPos);
    const afterMatch = text.slice(endPos);

    return (
      <>
        {beforeMatch}
        {match.startsWith(" ") && " "}
        <span className="font-bold bg-yellow-200">{match.trim()}</span>
        {match.endsWith(" ") && " "}
        {afterMatch}
      </>
    );
  };

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

  // Fungsi untuk menampilkan kategori dengan highlight
  const renderCategories = (categories: string[], query: string) => {
    return categories.map((category, index) => {
      const normalizedCategory = normalizeText(category);
      const normalizedQuery = normalizeText(query);

      if (query.trim() && normalizedCategory.includes(normalizedQuery)) {
        return (
          <span
            key={index}
            className="inline-block bg-gray-100 rounded-full px-2 py-1 text-xs mr-2 mb-2"
          >
            {highlightMatch(category, query)}
          </span>
        );
      }

      return (
        <span
          key={index}
          className="inline-block bg-gray-100 rounded-full px-2 py-1 text-xs mr-2 mb-2"
        >
          {category}
        </span>
      );
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Input
        type="text"
        placeholder="Cari doa..."
        className="w-full h-10 bg-white border rounded-md mb-4"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <div className="space-y-4">
        {filteredDuas.length > 0 ? (
          filteredDuas.map((dua) => (
            <Card key={dua.id} className="overflow-hidden">
              <CardHeader>
                <CardTitle className="text-lg">
                  {/* ID */}
                  <div className="text-xs text-gray-500">
                    <p>No. {dua.id}</p>
                  </div>

                  {highlightMatch(dua.title.title_id, query)}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-4">
                  {/* Arabic */}
                  <div className="text-right font-serif">
                    <p className="text-3xl leading-loose font-thin">
                      {highlightMatch(dua.arabic, query)}
                    </p>
                  </div>

                  {/* Transliteration */}
                  <div>
                    <p className="text-sm text-gray-500 italic">
                      {highlightMatch(dua.transliteration, query)}
                    </p>
                  </div>

                  {/* Translation */}
                  <div>
                    <p className="text-base">
                      {highlightMatch(dua.translation.translation_id, query)}
                    </p>
                  </div>

                  {/* Reference */}
                  <div className="pt-2 text-xs text-gray-500">
                    <p>{dua.reference}</p>
                  </div>

                  {/* Note */}
                  {dua.note.note_id ? (
                    <div className="pt-1 text-xs text-gray-500">
                      <p className="text-xs text-gray-500 mb-1">Keterangan:</p>
                      <p className="whitespace-pre-wrap">{dua.note.note_id}</p>
                    </div>
                  ) : null}

                  {/* Categories */}
                  <div className="pt-2">
                    <p className="text-xs text-gray-500 mb-1">Kategori:</p>
                    <div className="flex flex-wrap">
                      {renderCategories(dua.categories.categories_id, query)}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <p className="text-gray-500 text-center p-8">Tidak ditemukan</p>
        )}
      </div>
    </div>
  );
};
