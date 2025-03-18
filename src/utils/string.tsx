export const normalizeText = (text: string | null | undefined): string => {
  if (!text) return "";

  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Hapus aksen Latin (ā → a)
    .replace(/[\u064B-\u065F\u0670]/g, "") // Hapus harakat Arab (َ ُ ِ ّ ْ ـٰ)
    .replace(/[^a-z0-9\u0600-\u06FF]/g, "") // Hapus tanda baca, kecuali huruf Arab
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
