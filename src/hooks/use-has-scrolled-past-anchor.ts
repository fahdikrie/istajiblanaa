import { useEffect, useState } from "react";

export const useHasScrolledPastAnchor = (anchor: number) => {
  const [hasScrolledPastAnchor, setHasScrolledPastAnchor] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > anchor) {
        setHasScrolledPastAnchor(true);
      } else {
        setHasScrolledPastAnchor(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [anchor]);

  return hasScrolledPastAnchor;
};
