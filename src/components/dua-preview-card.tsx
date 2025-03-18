import type { Dua } from "@/types/dua";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { highlightMatch, normalizeText } from "@/utils/string";
import { cn } from "@/lib/utils";

export interface DuaPreviewCardProps {
  dua: Dua;
  query: string;
  shownAttributes?: Array<keyof Dua>;
  classNames?: {
    card?: string;
    header?: string;
    title?: string;
    content?: string;
  };
}

const DuaPreviewCard = ({
  dua,
  query,
  shownAttributes,
  classNames,
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
    <Card key={dua.id} className={cn("overflow-hidden", classNames?.card)}>
      <CardHeader className={cn(classNames?.header)}>
        <CardTitle className={cn("text-lg", classNames?.title)}>
          {/* ID */}
          {showAttribute("id") ? (
            <div className="text-xs text-gray-500">
              <p>No. {dua.id}</p>
            </div>
          ) : null}

          {/* Title */}
          {showAttribute("title")
            ? highlightMatch(dua.title.title_id, query)
            : null}
        </CardTitle>
        {showContent() ? (
          <CardContent className={cn(classNames?.content)}>
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
              <p className="text-sm text-gray-500 italic">
                {highlightMatch(dua.transliteration, query)}
              </p>
            ) : null}

            {/* Translation */}
            {showAttribute("translation") ? (
              <p className="text-base">
                {highlightMatch(dua.translation.translation_id, query)}
              </p>
            ) : null}

            {/* Source */}
            {showAttribute("source") ? (
              <div className="pt-2 text-xs text-gray-500">
                <p>{dua.source}</p>
              </div>
            ) : null}

            {/* Reference */}
            {showAttribute("reference") ? (
              <div className="pt-1 text-xs text-gray-500">
                <p>{dua.reference}</p>
              </div>
            ) : null}

            {/* Note */}
            {showAttribute("note") && dua.note.note_id ? (
              <div className="pt-1 text-xs text-gray-500">
                <p className="text-xs text-gray-500 mb-1">Keterangan:</p>
                <p className="whitespace-pre-wrap">{dua.note.note_id}</p>
              </div>
            ) : null}

            {/* Categories */}
            {showAttribute("categories") ? (
              <div className="pt-2">
                <p className="text-xs text-gray-500 mb-1">Kategori:</p>
                <div className="flex flex-wrap">
                  {renderCategories(dua.categories.categories_id, query)}
                </div>
              </div>
            ) : null}
          </CardContent>
        ) : null}
      </CardHeader>
    </Card>
  );
};

export { DuaPreviewCard };
