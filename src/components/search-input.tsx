// components/search/search-input.tsx
import { useStore } from "@nanostores/react";
import { EyeOff } from "lucide-react";
import { toast } from "sonner";

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";

import { shownAttributesAtom } from "@/store/store";
import type { Dua } from "@/types/dua";

const SHOWN_ATTRIBUTES_OPTIONS: { key: keyof Dua; label: string }[] = [
  { key: "id", label: "Nomor" },
  { key: "title", label: "Judul" },
  { key: "arabic", label: "Teks Bahasa Arab" },
  { key: "transliteration", label: "Transliterasi" },
  { key: "translation", label: "Terjemahan" },
  { key: "categories", label: "Kategori" },
  { key: "source", label: "Sumber" },
  { key: "reference", label: "Referensi" },
  { key: "occasion", label: "Kondisi/Sebab" },
  { key: "benefits", label: "Manfaat" },
  { key: "note", label: "Keterangan" },
];

export interface SearchInputProps {
  query: string;
  onQueryChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}

export const SearchInput = ({
  query,
  onQueryChange,
  placeholder = "Cari doa...",
}: SearchInputProps) => {
  const shownAttributes = useStore(shownAttributesAtom);

  return (
    <div className="w-full flex items-center gap-x-1">
      <Input
        type="text"
        placeholder={placeholder}
        className="flex-1 h-10 bg-white dark:bg-white dark:text-black border rounded-md shadow-none placeholder:text-xs md:placeholder:text-sm"
        value={query}
        onChange={onQueryChange}
      />
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger className="w-10 h-10 bg-white flex items-center justify-center rounded-md border shadow-none">
          <EyeOff absoluteStrokeWidth className="text-gray-500 w-4 h-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-60">
          <DropdownMenuLabel className="text-gray-500 dark:text-zinc-300">
            Atur tampilan doa
          </DropdownMenuLabel>
          {SHOWN_ATTRIBUTES_OPTIONS.map(({ key, label }, index) => (
            <DropdownMenuCheckboxItem
              key={`key-${index}`}
              checked={shownAttributes.includes(key)}
              onSelect={(e) => e.preventDefault()}
              onCheckedChange={(checked) => {
                if (shownAttributes.length === 1 && checked === false) {
                  toast("Pilih minimal satu atribut");
                  return;
                }

                shownAttributesAtom.set(
                  checked
                    ? [...shownAttributes, key]
                    : shownAttributes.filter((attr) => attr !== key),
                );
              }}
            >
              {label}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
