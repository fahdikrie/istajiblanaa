import { useState, type TouchEvent } from "react";

import { useIsMobile } from "@/hooks/use-mobile";

export interface SwipeConfig {
  minSwipeDistance?: number;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
}

export const useSwipe = ({
  minSwipeDistance = 75,
  onSwipeLeft,
  onSwipeRight,
}: SwipeConfig = {}) => {
  const isMobile = useIsMobile();
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const onTouchStart = (e: TouchEvent<HTMLDivElement>) => {
    if (!isMobile) return;
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: TouchEvent<HTMLDivElement>) => {
    if (!isMobile) return;
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!isMobile) return;
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && onSwipeLeft) {
      onSwipeLeft();
    } else if (isRightSwipe && onSwipeRight) {
      onSwipeRight();
    }
  };

  return {
    touchStart,
    touchEnd,
    onTouchStart,
    onTouchMove,
    onTouchEnd,
  };
};
