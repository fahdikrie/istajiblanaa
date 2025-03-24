import { useStore } from "@nanostores/react";
import { Filter } from "lucide-react";
import { toast } from "sonner";

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { searchFieldsAtom } from "@/store/store";
import type { Dua } from "@/types/dua";

const SEARCH_FIELDS_OPTIONS: { key: keyof Dua; label: string }[] = [
  { key: "title", label: "Judul" },
  { key: "arabic", label: "Teks Bahasa Arab" },
  { key: "transliteration", label: "Transliterasi" },
  { key: "translation", label: "Terjemahan" },
  { key: "categories", label: "Kategori" },
];

export const SelectSearchBy = () => {
  const searchFields = useStore(searchFieldsAtom);

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger className="w-10 h-10 bg-white flex items-center justify-center rounded-md border shadow-none">
        <Filter absoluteStrokeWidth className="text-gray-500 w-4 h-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-60">
        <DropdownMenuLabel className="text-gray-500 dark:text-zinc-300">
          Cari berdasarkan
        </DropdownMenuLabel>
        {SEARCH_FIELDS_OPTIONS.map(({ key, label }, index) => (
          <DropdownMenuCheckboxItem
            key={`key-${index}`}
            checked={searchFields.includes(key)}
            onSelect={(e) => e.preventDefault()}
            onCheckedChange={(checked) => {
              if (searchFields.length === 1 && checked === false) {
                toast("Pilih minimal satu bidang pencarian");
                return;
              }

              searchFieldsAtom.set(
                checked
                  ? [...searchFields, key]
                  : searchFields.filter((field) => field !== key),
              );
            }}
          >
            {label}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
