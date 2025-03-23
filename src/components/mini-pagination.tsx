import { motion } from "motion/react";

export interface MiniPaginationProps {
  currentPage: number;
  totalPages: number;
  onPrevPage: () => void;
  onNextPage: () => void;
}

export const MiniPagination = ({
  currentPage,
  totalPages,
  onPrevPage,
  onNextPage,
}: MiniPaginationProps) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center text-xs gap-2">
      <motion.span
        className={`cursor-pointer underline ${
          currentPage === 1
            ? "text-gray-300 dark:text-gray-600"
            : "text-gray-500 dark:text-zinc-400 hover:text-gray-700 dark:hover:text-zinc-200"
        }`}
        onClick={onPrevPage}
        whileTap={{ scale: 0.9 }}
      >
        Prev
      </motion.span>

      <span className="text-gray-700 dark:text-zinc-300">
        {currentPage} / {totalPages}
      </span>

      <motion.span
        className={`cursor-pointer underline ${
          currentPage === totalPages
            ? "text-gray-300 dark:text-gray-600"
            : "text-gray-500 dark:text-zinc-400 hover:text-gray-700 dark:hover:text-zinc-200"
        }`}
        onClick={onNextPage}
        whileTap={{ scale: 0.9 }}
      >
        Next
      </motion.span>
    </div>
  );
};
