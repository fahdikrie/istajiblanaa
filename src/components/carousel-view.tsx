import { useStore } from "@nanostores/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, usePresenceData } from "motion/react";
import { useState } from "react";

import { Button } from "@/components/ui/button";

import { useSwipe } from "@/hooks/use-swipe";

import { cn } from "@/lib/utils";
import { arabicFontAtom, languageAtom, savedDuasAtom } from "@/store/store";
import type { Dua } from "@/types/dua";

import { DuaShortcuts } from "./dua-shortcuts";

export interface CarouselViewProps {
  duas: Dua[];
  query: string;
  currentIndex?: number;
  setCurrentIndex?: React.Dispatch<React.SetStateAction<number>>;
}

export const CarouselView = ({
  duas,
  query,
  currentIndex = 0,
  setCurrentIndex = () => {},
}: CarouselViewProps) => {
  const [direction, setDirection] = useState(0);

  const arabicFont = useStore(arabicFontAtom);
  const language = useStore(languageAtom);
  const savedDuas = useStore(savedDuasAtom);

  const presenceDirection = usePresenceData();

  const animationDirection =
    presenceDirection !== undefined ? presenceDirection : direction;

  const currentDua = duas[currentIndex];

  const goToNext = () => {
    if (currentIndex < duas.length - 1) {
      setDirection(1);
      setCurrentIndex(currentIndex + 1);
    }
  };

  const goToPrev = () => {
    if (currentIndex > 0) {
      setDirection(-1);
      setCurrentIndex(currentIndex - 1);
    }
  };

  // Swipe functionality for mobile
  const { onTouchStart, onTouchMove, onTouchEnd } = useSwipe({
    onSwipeLeft: goToNext,
    onSwipeRight: goToPrev,
  });

  const renderCategories = (categories: string[]) => {
    return categories.map((category, index) => (
      <span
        key={index}
        className="inline-block bg-gray-100 rounded-full px-2 py-1 text-xs mr-2 mb-2"
      >
        {category}
      </span>
    ));
  };

  const title =
    language === "id" ? currentDua.title.title_id : currentDua.title.title_en;
  const translation =
    language === "id"
      ? currentDua.translation.translation_id
      : currentDua.translation.translation_en;
  const note =
    language === "id" ? currentDua.note.note_id : currentDua.note.note_en;
  const categories =
    language === "id"
      ? currentDua.categories.categories_id
      : currentDua.categories.categories_en;

  // If no duas match the search query
  if (duas.length === 0) {
    return (
      <div className="text-center py-10">
        <p>Tidak ada doa yang cocok dengan pencarian "{query}"</p>
      </div>
    );
  }

  return (
    <div className="mt-4">
      {/* Navigation buttons at the top */}
      <div className="flex items-center justify-between mb-4">
        <Button
          onClick={goToPrev}
          disabled={currentIndex === 0}
          variant="outline"
          size="sm"
          className="flex items-center gap-1"
        >
          <ChevronLeft className="h-4 w-4" />
          Sebelumnya
        </Button>

        <div className="text-sm text-gray-500">
          {currentIndex + 1} / {duas.length}
        </div>

        <Button
          onClick={goToNext}
          disabled={currentIndex === duas.length - 1}
          variant="outline"
          size="sm"
          className="flex items-center gap-1"
        >
          Selanjutnya
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div
        className="relative overflow-hidden"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {/* Use the same animation as ListContent */}
        <motion.div
          key={currentDua.id}
          initial={{ opacity: 0, x: animationDirection * 50 }}
          animate={{
            opacity: 1,
            x: 0,
            transition: {
              type: "spring",
              stiffness: 300,
              damping: 30,
              duration: 0.3,
            },
          }}
          exit={{
            opacity: 0,
            x: animationDirection * -50,
            transition: {
              duration: 0.2,
            },
          }}
          className="min-h-[calc(60vh)] p-4 md:pt-6 md:px-6 border shadow-sm rounded-lg overflow-auto flex flex-col gap-y-4 border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-950"
        >
          {/* ID */}
          <div className="text-xs font-semibold text-gray-500 dark:text-zinc-400 -mb-4">
            <p>No. {currentDua.id}</p>
          </div>

          {/* Title */}
          <h6 className="font-medium text-lg">{title}</h6>

          {/* Arabic */}
          <div className="text-right">
            <p className={cn("text-3xl leading-loose font-thin", arabicFont)}>
              {currentDua.arabic}
            </p>
          </div>

          {/* Transliteration */}
          <p className="text-sm text-gray-500 dark:text-zinc-400 italic">
            {currentDua.transliteration}
          </p>

          {/* Translation */}
          <p className="text-base">{translation}</p>

          <div>
            {/* Source */}
            <div className="text-xs text-gray-500 dark:text-zinc-400">
              <p>{currentDua.source}</p>
            </div>

            {/* Reference */}
            <div className="text-xs text-gray-500 dark:text-zinc-400">
              <p>{currentDua.reference}</p>
            </div>
          </div>

          {/* Note */}
          {note ? (
            <div className="text-xs text-gray-500 dark:text-zinc-400">
              <p className="text-xs text-gray-500 dark:text-zinc-400 mb-1">
                Keterangan:
              </p>
              <p className="whitespace-pre-wrap">{}</p>
            </div>
          ) : null}

          {/* Categories */}
          <div>
            <p className="text-xs text-gray-500 dark:text-zinc-400 mb-1">
              Kategori:
            </p>
            <div className="flex flex-wrap dark:text-gray-800">
              {renderCategories(categories)}
            </div>
          </div>

          <DuaShortcuts dua={currentDua} savedDuas={savedDuas} />
        </motion.div>
      </div>
    </div>
  );
};
