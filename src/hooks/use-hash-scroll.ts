import { useEffect, useRef } from "react";

import type { Dua } from "@/types/dua";

export const useHashScroll = (
  allItems: Dua[],
  findItemByHash: (hash: string) => Dua | undefined,
  goToPage: (page: number) => void,
  getItemPage: (item: Dua) => number,
  options = { behavior: "smooth" as ScrollBehavior },
) => {
  const scrollTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    const scrollToHashElement = () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      const hash = window.location.hash.substring(1);

      if (hash) {
        const targetItem = findItemByHash(hash);

        if (targetItem) {
          const targetPage = getItemPage(targetItem);

          goToPage(targetPage);

          // Then scroll to the element after a small delay
          scrollTimeoutRef.current = setTimeout(() => {
            const element = document.getElementById(hash);
            if (element) {
              element.scrollIntoView(options);
            }
          }, 300);
        }
      }
    };

    scrollToHashElement();
    window.addEventListener("hashchange", scrollToHashElement);

    return () => {
      window.removeEventListener("hashchange", scrollToHashElement);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [allItems, findItemByHash, goToPage, getItemPage, options]);
};
