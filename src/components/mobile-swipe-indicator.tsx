import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { motion } from "motion/react";

export interface MobileSwipeIndicatorProps {
  currentPage: number;
  totalPages: number;
  touchStart: number | null;
  touchEnd: number | null;
}

export const MobileSwipeIndicator = ({
  currentPage,
  totalPages,
  touchStart,
  touchEnd,
}: MobileSwipeIndicatorProps) => {
  if (totalPages <= 1) return null;

  return (
    <div className="absolute top-1/2 left-0 w-full flex justify-between items-center z-10 pointer-events-none px-2">
      {currentPage > 1 && (
        <motion.div
          className="bg-gray-100/60 dark:bg-gray-800/60 p-2 rounded-full"
          initial={{ opacity: 0 }}
          animate={{
            opacity:
              touchStart && touchEnd && touchStart - touchEnd < -20 ? 0.7 : 0,
          }}
        >
          <ChevronLeftIcon className="invisible w-6 h-6 text-gray-800 dark:text-gray-200" />
        </motion.div>
      )}

      {currentPage < totalPages && (
        <motion.div
          className="bg-gray-100/60 dark:bg-gray-800/60 p-2 rounded-full ml-auto"
          initial={{ opacity: 0 }}
          animate={{
            opacity:
              touchStart && touchEnd && touchStart - touchEnd > 20 ? 0.7 : 0,
          }}
        >
          <ChevronRightIcon className="invisible w-6 h-6 text-gray-800 dark:text-gray-200" />
        </motion.div>
      )}
    </div>
  );
};
