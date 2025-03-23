import { useState } from "react";

export interface PaginationConfig {
  initialPage?: number;
  itemsPerPage?: number;
}

export const usePagination = <T>(
  items: T[],
  { initialPage = 1, itemsPerPage = 10 }: PaginationConfig = {},
) => {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [direction, setDirection] = useState(1);

  const totalItems = items.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const getCurrentPageItems = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return items.slice(startIndex, endIndex);
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      setDirection(-1);
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setDirection(1);
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setDirection(page > currentPage ? 1 : -1);
      setCurrentPage(page);
    }
  };

  return {
    currentPage,
    totalPages,
    totalItems,
    paginatedItems: getCurrentPageItems(),
    goToPrevPage,
    goToNextPage,
    goToPage,
    direction,
    setPage: setCurrentPage,
    setDirection,
  };
};
