import { useStore } from "@nanostores/react";
import { MoveRight, X } from "lucide-react";
import React, { useEffect, useState } from "react";

import { useIsMobile } from "@/hooks/use-mobile";

import { cn } from "@/lib/utils";
import { announcementBarAtom } from "@/store/store";

interface announcementBarAtom {
  eventId: string;
  eventMessage: string;
  eventLink?: string;
  bgColor?: string;
  textColor?: string;
  className?: string;
}

export const AnnouncementBar: React.FC<announcementBarAtom> = ({
  eventId,
  eventMessage,
  eventLink,
  bgColor = "bg-orange-500",
  textColor = "text-white",
  className,
}) => {
  const isMobile = useIsMobile();

  const [isVisible, setIsVisible] = useState(false);

  const eventBanner = useStore(announcementBarAtom);

  useEffect(() => {
    // Check if this specific event has been dismissed before
    const hasBeenDismissed = eventBanner.dismissedEvents.includes(eventId);
    setIsVisible(!hasBeenDismissed);
  }, [eventId]);

  const handleClose = () => {
    // Update the store to mark this event as dismissed
    announcementBarAtom.set({
      isBannerVisible: false,
      dismissedEvents: [...eventBanner.dismissedEvents, eventId],
    });
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div
      className={cn(
        "w-full px-4 py-2 flex items-center justify-between",
        "text-sm font-medium relative z-50 md:h-9",
        bgColor,
        textColor,
        className,
      )}
    >
      <a
        className="flex-grow text-xs md:text-sm flex items-center hover:underline cursor-pointer md:absolute md:left-1/2 md:-translate-x-1/2"
        href={eventLink}
      >
        {eventMessage}
        <span className="ml-2">
          <MoveRight size={isMobile ? 16 : 20} />
        </span>
      </a>

      <button
        onClick={handleClose}
        className={`
          ml-auto hover:opacity-75 transition-opacity cursor-pointer
          ${textColor}
        `}
        aria-label="Close banner"
      >
        <X size={isMobile ? 16 : 20} />
      </button>
    </div>
  );
};
