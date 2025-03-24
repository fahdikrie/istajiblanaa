import type { Dua } from "@/types/dua";

export const normalizeText = (text: string | null | undefined): string => {
  if (!text) return "";

  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[\u064B-\u065F\u0670]/g, "") // Ignore harakat (َ ُ ِ ّ ْ ـٰ)
    .replace(/[^a-z0-9\u0600-\u06FF]/g, "") // Ignore y
    .replace(/\s+/g, ""); // Hilangkan semua spasi
};

export const highlightMatch = (
  text: string | null | undefined,
  query: string,
) => {
  if (!text) return "";
  if (!query.trim()) return text;

  const normalizedText = normalizeText(text);
  const normalizedQuery = normalizeText(query);

  if (normalizedQuery.length === 0) return text;

  const index = normalizedText.indexOf(normalizedQuery);
  if (index === -1) return text;

  let startPos = 0;
  let currentPos = 0;

  for (let i = 0; i < text.length && currentPos < index; i++) {
    const char = text[i];
    if (normalizeText(char).length > 0) {
      currentPos++;
    }
    startPos++;
  }

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
      <span className="font-bold bg-yellow-300 dark:bg-orange-500">
        {match.trim()}
      </span>
      {match.endsWith(" ") && " "}
      {afterMatch}
    </>
  );
};

export const highlightMatchByField = (
  text: string | null | undefined,
  query: string,
  field: keyof Dua,
  searchFields: (keyof Dua)[],
) => {
  if (!text) return "";
  if (!query.trim()) return text;
  if (!searchFields.includes(field)) return text; // Only highlight if the field is in searchFields

  const normalizedText = normalizeText(text);
  const normalizedQuery = normalizeText(query);

  if (normalizedQuery.length === 0) return text;

  const index = normalizedText.indexOf(normalizedQuery);
  if (index === -1) return text;

  let startPos = 0;
  let currentPos = 0;

  for (let i = 0; i < text.length && currentPos < index; i++) {
    const char = text[i];
    if (normalizeText(char).length > 0) {
      currentPos++;
    }
    startPos++;
  }

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
      <span className="font-bold bg-yellow-300 dark:bg-orange-500">
        {match.trim()}
      </span>
      {match.endsWith(" ") && " "}
      {afterMatch}
    </>
  );
};

export const slugify = (text: string) => {
  return text
    .toLowerCase()
    .replace(/ /g, "-")
    .replace(/\//g, "-")
    .replace(/[^\w\-]/g, "");
};
