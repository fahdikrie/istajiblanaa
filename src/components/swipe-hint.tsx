export interface SwipeHintProps {
  currentPage: number;
  totalPages: number;
}

export const SwipeHint = ({ currentPage, totalPages }: SwipeHintProps) => {
  if (totalPages <= 1) return null;

  return (
    <div className="text-xs text-gray-400 text-center mt-4 mb-2">
      {currentPage < totalPages && currentPage > 1 ? (
        <span>Geser ke kiri/kanan untuk navigasi</span>
      ) : currentPage === 1 ? (
        <span>Geser ke kiri untuk lanjut</span>
      ) : (
        <span>Geser ke kanan untuk kembali</span>
      )}
    </div>
  );
};
