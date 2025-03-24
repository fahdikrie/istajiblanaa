import { Input } from "@/components/ui/input";
import { SelectDuaVisibility } from "@/components/select-dua-visibility";
import { SelectSearchBy } from "@/components/select-search-by";

import { cn } from "@/lib/utils";

export interface SearchInputProps {
  query: string;
  onQueryChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  className?: string;
}

export const SearchInput = ({
  query,
  onQueryChange,
  placeholder = "Cari doa...",
  className,
}: SearchInputProps) => {
  return (
    <div className="w-full flex items-center gap-x-1">
      <Input
        type="text"
        placeholder={placeholder}
        className={cn(
          "flex-1 h-10 bg-white dark:bg-white dark:text-black border rounded-md shadow-none placeholder:text-xs md:placeholder:text-sm",
          className,
        )}
        value={query}
        onChange={onQueryChange}
      />
      <SelectSearchBy />
      <SelectDuaVisibility />
    </div>
  );
};
