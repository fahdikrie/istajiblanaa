import { useStore } from "@nanostores/react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import { cn } from "@/lib/utils";
import { arabicFontAtom, languageAtom } from "@/store/store";
import type { Dua } from "@/types/dua";

export interface DetailPageProps {
  dua: Dua;
}

const DetailPage = ({ dua }: DetailPageProps) => {
  const arabicFont = useStore(arabicFontAtom);
  const language = useStore(languageAtom);

  const renderCategories = (categories: string[]) => {
    return categories.map((category, index) => {
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

  const title = language === "id" ? dua.title.title_id : dua.title.title_en;
  const translation =
    language === "id"
      ? dua.translation.translation_id
      : dua.translation.translation_en;
  const note = language === "id" ? dua.note.note_id : dua.note.note_en;
  const categories =
    language === "id"
      ? dua.categories.categories_id
      : dua.categories.categories_en;

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b">
        <div className="w-full md:w-fit flex items-center justify-between md:justify-start flex-row-reverse md:flex-row gap-2 px-4">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/">Beranda</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>{dua.title.title_id}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <section className="max-w-2xl min-h-[calc(100svh-133px)] mx-auto p-4 md:pt-10 md:px-10 border-x-1 shadow-xs overflow-auto flex flex-col gap-y-4 border-gray-100 dark:border-inherit bg-white dark:bg-inherit">
        {/* ID */}
        <div className="text-xs font-semibold text-gray-500 dark:text-zinc-400 -mb-4">
          <p>No. {dua.id}</p>
        </div>

        {/* Title */}
        <h6 className="font-medium text-lg">{title}</h6>

        {/* Arabic */}
        <div className="text-right">
          <p className={cn("text-3xl leading-loose font-thin", arabicFont)}>
            {dua.arabic}
          </p>
        </div>

        {/* Transliteration */}
        <p className="text-sm text-gray-500 dark:text-zinc-400 italic">
          {dua.transliteration}
        </p>

        {/* Translation */}
        <p className="text-base">{translation}</p>

        <div>
          {/* Source */}
          <div className="text-xs text-gray-500 dark:text-zinc-400">
            <p>{dua.source}</p>
          </div>

          {/* Reference */}
          <div className="text-xs text-gray-500 dark:text-zinc-400">
            <p>{dua.reference}</p>
          </div>
        </div>

        {/* Note */}
        {note ? (
          <div className="text-xs text-gray-500 dark:text-zinc-400">
            <p className="text-xs text-gray-500 dark:text-zinc-400 mb-1">
              {language === "id" ? "Keterangan:" : "Note:"}
            </p>
            <p className="whitespace-pre-wrap">{note}</p>
          </div>
        ) : null}

        {/* Categories */}
        <div>
          <p className="text-xs text-gray-500 dark:text-zinc-400 mb-1">
            {language === "id" ? "Kategori:" : "Categories:"}
          </p>
          <div className="flex flex-wrap dark:text-gray-800">
            {renderCategories(categories)}
          </div>
        </div>
      </section>
    </>
  );
};

export { DetailPage };
