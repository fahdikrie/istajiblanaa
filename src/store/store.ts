import { persistentAtom } from "@nanostores/persistent";

import type { Dua } from "@/types/dua";

export const shownAttributesAtom = persistentAtom<Array<keyof Dua>>(
  "shownAttributes",
  ["id", "title", "arabic", "source", "reference"],
  {
    encode: JSON.stringify,
    decode: JSON.parse,
  },
);

export const themeAtom = persistentAtom<"theme-light" | "dark">(
  "theme",
  "theme-light",
  {
    encode: JSON.stringify,
    decode: JSON.parse,
  },
);

export const arabicFontAtom = persistentAtom<
  "font-amiri" | "font-noto-sans-arabic"
>("arabicFont", "font-amiri");

export const languageAtom = persistentAtom<"id" | "en">("language", "id");
