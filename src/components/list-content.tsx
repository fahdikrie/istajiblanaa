import { useStore } from "@nanostores/react";
import { motion, usePresenceData } from "motion/react";

import { DuaPreviewCard } from "@/components/dua-preview-card";

import { languageAtom } from "@/store/store";
import type { Dua } from "@/types/dua";
import { slugify } from "@/utils/string";

export interface ListContentProps {
  items: Dua[];
  query: string;
  shownAttributes: Array<keyof Dua>;
  direction: number;
}

export const ListContent = ({
  items,
  query,
  shownAttributes,
  direction,
}: ListContentProps) => {
  const language = useStore(languageAtom);
  const presenceDirection = usePresenceData();
  const animationDirection =
    presenceDirection !== undefined ? presenceDirection : direction;

  const generateTitle = (dua: Dua) =>
    language === "id" ? dua.title.title_id : dua.title.title_en;

  return (
    <motion.div
      className="space-y-4 flex flex-col w-full scroll-smooth"
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
    >
      {items.length > 0 ? (
        items.map((dua, index) => (
          <DuaPreviewCard
            id={slugify(generateTitle(dua))}
            key={`${generateTitle(dua)}-${index}`}
            dua={dua}
            query={query}
            shownAttributes={shownAttributes}
            className="py-3"
          />
        ))
      ) : (
        <p className="text-gray-500 text-center p-8">Tidak ditemukan</p>
      )}
    </motion.div>
  );
};
