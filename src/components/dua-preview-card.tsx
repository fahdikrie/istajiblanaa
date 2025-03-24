import { useStore } from "@nanostores/react";
import { Bookmark, BookmarkCheck, ExternalLink, Link } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { cn } from "@/lib/utils";
import {
  arabicFontAtom,
  languageAtom,
  savedDuasAtom,
  searchFieldsAtom,
} from "@/store/store";
import type { Dua } from "@/types/dua";
import { highlightMatchByField, normalizeText, slugify } from "@/utils/string";

export interface DuaPreviewCardProps {
  id: string;
  dua: Dua;
  query: string;
  shownAttributes?: Array<keyof Dua>;
  className?: string;
  onPreview?: (dua: Dua) => void;
}

const DuaPreviewCard = ({
  id,
  dua,
  query,
  shownAttributes,
  className,
}: DuaPreviewCardProps) => {
  const arabicFont = useStore(arabicFontAtom);
  const language = useStore(languageAtom);
  const savedDuas = useStore(savedDuasAtom);
  const searchFields = useStore(searchFieldsAtom);

  const isDuaSaved = savedDuas.includes(dua.id);

  const showAttribute = (attribute: keyof Dua) => {
    if (!shownAttributes) return true;

    return shownAttributes.includes(attribute);
  };

  const title = language === "id" ? dua.title.title_id : dua.title.title_en;
  const translation =
    language === "id"
      ? dua.translation.translation_id
      : dua.translation.translation_en;
  const categories =
    language === "id"
      ? dua.categories.categories_id
      : dua.categories.categories_en;

  const renderCategories = (categories: string[], query: string) => {
    return categories.map((category, index) => {
      const normalizedCategory = normalizeText(category);
      const normalizedQuery = normalizeText(query);

      if (
        query.trim() &&
        normalizedCategory.includes(normalizedQuery) &&
        searchFields.includes("categories")
      ) {
        return (
          <span
            key={index}
            className="inline-block bg-gray-100 rounded-full px-2 py-1 text-xs mr-2 mb-2"
          >
            {highlightMatchByField(category, query, "categories", searchFields)}
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

  const handleToggleSave = () => {
    if (isDuaSaved) {
      savedDuasAtom.set(savedDuas.filter((id) => id !== dua.id));
      toast("Doa dihapus dari penyimpanan");
    } else {
      savedDuasAtom.set([...savedDuas, dua.id]);
      toast("Doa berhasil disimpan");
    }
  };

  const handleCopyLink = () => {
    const url = `${window.location.origin}/dua/${dua.id}-${slugify(title)}`;
    navigator.clipboard.writeText(url);

    toast("Tautan berhasil disalin");
  };

  const detailPageUrl = `/dua/${dua.id}-${slugify(title)}`;

  return (
    <Card
      id={id}
      key={dua.id}
      className={cn(
        "group p-4 border-gray-100 dark:border-inherit shadow-none bg-white dark:bg-inherit",
        className,
      )}
    >
      <div className="flex flex-col gap-y-4">
        {/* ID */}
        {showAttribute("id") ? (
          <div className="text-xs font-semibold text-gray-500 dark:text-zinc-400 -mb-4">
            <p>No. {dua.id}</p>
          </div>
        ) : null}

        {/* Title */}
        {showAttribute("title") ? (
          <a href={detailPageUrl} className="cursor-pointer">
            <h6 className="font-medium text-lg group-hover:underline">
              {highlightMatchByField(
                dua.title[`title_${language}`],
                query,
                "title",
                searchFields,
              )}
            </h6>
          </a>
        ) : null}

        {/* Arabic */}
        {showAttribute("arabic") ? (
          <div className="text-right">
            <p className={cn("text-3xl leading-loose font-thin", arabicFont)}>
              {highlightMatchByField(dua.arabic, query, "arabic", searchFields)}
            </p>
          </div>
        ) : null}

        {/* Transliteration */}
        {showAttribute("transliteration") ? (
          <p className="text-sm text-gray-500 dark:text-zinc-400 italic">
            {highlightMatchByField(
              dua.transliteration,
              query,
              "transliteration",
              searchFields,
            )}
          </p>
        ) : null}

        {/* Translation */}
        {showAttribute("translation") ? (
          <p className="text-base">
            {highlightMatchByField(
              translation,
              query,
              "translation",
              searchFields,
            )}
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
              <p>
                {highlightMatchByField(
                  dua.source,
                  query,
                  "source",
                  searchFields,
                )}
              </p>
            </div>
          ) : null}

          {/* Reference */}
          {showAttribute("reference") ? (
            <div className="text-xs text-gray-500 dark:text-zinc-400">
              <p>
                {highlightMatchByField(
                  dua.reference,
                  query,
                  "reference",
                  searchFields,
                )}
              </p>
            </div>
          ) : null}
        </div>

        {/* Note */}
        {showAttribute("note") && dua.note.note_id ? (
          <div className="text-xs text-gray-500 dark:text-zinc-400">
            <p className="text-xs text-gray-500 dark:text-zinc-400 mb-1">
              Keterangan:
            </p>
            <p className="whitespace-pre-wrap">
              {highlightMatchByField(
                dua.note.note_id,
                query,
                "note",
                searchFields,
              )}
            </p>
          </div>
        ) : null}

        {/* Categories */}
        {showAttribute("categories") ? (
          <div>
            <p className="text-xs text-gray-500 dark:text-zinc-400 mb-1">
              Kategori:
            </p>
            <div className="flex flex-wrap dark:text-gray-800">
              {renderCategories(categories, query)}
            </div>
          </div>
        ) : null}

        {/* Occasion */}
        {showAttribute("occasion") && dua.occasion?.occasion_id ? (
          <div className="text-xs text-gray-500 dark:text-zinc-400">
            <p className="text-xs text-gray-500 dark:text-zinc-400 mb-1">
              Kondisi/Sebab:
            </p>
            <p className="whitespace-pre-wrap">
              {highlightMatchByField(
                language === "id"
                  ? dua.occasion.occasion_id
                  : dua.occasion.occasion_en,
                query,
                "occasion",
                searchFields,
              )}
            </p>
          </div>
        ) : null}
      </div>

      {/* Shortcuts */}
      <div className="flex items-center justify-end gap-2 pt-2 mt-2 border-t border-gray-100 dark:border-zinc-800">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={handleToggleSave}
                aria-label={isDuaSaved ? "Remove from saved" : "Save dua"}
              >
                {isDuaSaved ? (
                  <BookmarkCheck className="h-4 w-4 text-primary" />
                ) : (
                  <Bookmark className="h-4 w-4" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{isDuaSaved ? "Saved" : "Save"}</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={handleCopyLink}
                aria-label="Copy link"
              >
                <Link className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Copy Link</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                <a href={detailPageUrl} aria-label="Go to dua detail page">
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Detail Page</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </Card>
  );
};

export { DuaPreviewCard };
