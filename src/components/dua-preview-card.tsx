import { Card } from "@/components/ui/card";

import { cn } from "@/lib/utils";
import type { Dua } from "@/types/dua";
import { highlightMatch, normalizeText } from "@/utils/string";

export interface DuaPreviewCardProps {
  dua: Dua;
  query: string;
  shownAttributes?: Array<keyof Dua>;
  className?: string;
}

const DuaPreviewCard = ({
  dua,
  query,
  shownAttributes,
  className,
}: DuaPreviewCardProps) => {
  const showAttribute = (attribute: keyof Dua) => {
    if (!shownAttributes) return true;

    return shownAttributes.includes(attribute);
  };

  const showContent = () => {
    return (
      showAttribute("arabic") ||
      showAttribute("translation") ||
      showAttribute("transliteration") ||
      showAttribute("categories") ||
      showAttribute("source") ||
      showAttribute("reference") ||
      showAttribute("occasion") ||
      showAttribute("benefits") ||
      showAttribute("note")
    );
  };

  const renderCategories = (categories: string[], query: string) => {
    return categories.map((category, index) => {
      const normalizedCategory = normalizeText(category);
      const normalizedQuery = normalizeText(query);

      if (query.trim() && normalizedCategory.includes(normalizedQuery)) {
        return (
          <span
            key={index}
            className="inline-block bg-gray-100 rounded-full px-2 py-1 text-[10px]   mr-2 mb-2"
          >
            {highlightMatch(category, query)}
          </span>
        );
      }

      return (
        <span
          key={index}
          className="inline-block bg-gray-100 rounded-full px-2 py-1 text-[10px]   mr-2 mb-2"
        >
          {category}
        </span>
      );
    });
  };
  return (
    <Card
      key={dua.id}
      className={cn(
        "flex flex-col gap-y-4 p-4 border-gray-100 dark:border-white shadow-none bg-white dark:bg-black",
        className,
      )}
    >
      {/* ID */}
      {showAttribute("id") ? (
        <div className="text-xs font-semibold text-gray-500 dark:text-zinc-400 -mb-4">
          <p>No. {dua.id}</p>
        </div>
      ) : null}

      {/* Title */}
      {showAttribute("title") ? (
        <h6 className="font-medium text-lg">
          {highlightMatch(dua.title.title_id, query)}
        </h6>
      ) : null}

      {/* Arabic */}
      {showAttribute("arabic") ? (
        <div className="text-right font-serif">
          <p className="text-3xl leading-loose font-thin">
            {highlightMatch(dua.arabic, query)}
          </p>
        </div>
      ) : null}

      {/* Transliteration */}
      {showAttribute("transliteration") ? (
        <p className="text-sm text-gray-500 dark:text-zinc-400 italic">
          {highlightMatch(dua.transliteration, query)}
        </p>
      ) : null}

      {/* Translation */}
      {showAttribute("translation") ? (
        <p className="text-base">
          {highlightMatch(dua.translation.translation_id, query)}
        </p>
      ) : null}

      <div
        className={
          !showAttribute("source") && !showAttribute("reference")
            ? "hidden"
            : "block"
        }
      >
        {/* Source */}
        {showAttribute("source") ? (
          <div className="text-xs text-gray-500 dark:text-zinc-400">
            <p>{dua.source}</p>
          </div>
        ) : null}

        {/* Reference */}
        {showAttribute("reference") ? (
          <div className="text-xs text-gray-500 dark:text-zinc-400">
            <p>{dua.reference}</p>
          </div>
        ) : null}
      </div>

      {/* Note */}
      {showAttribute("note") && dua.note.note_id ? (
        <div className="text-xs text-gray-500 dark:text-zinc-400">
          <p className="text-xs text-gray-500 dark:text-zinc-400 mb-1">
            Keterangan:
          </p>
          <p className="whitespace-pre-wrap">{dua.note.note_id}</p>
        </div>
      ) : null}

      {/* Categories */}
      {showAttribute("categories") ? (
        <div className="">
          <p className="text-xs text-gray-500 dark:text-zinc-400 mb-1">
            Kategori:
          </p>
          <div className="flex flex-wrap dark:text-gray-800">
            {renderCategories(dua.categories.categories_id, query)}
          </div>
        </div>
      ) : null}
    </Card>
  );
};

export { DuaPreviewCard };
