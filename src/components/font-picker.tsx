"use client";

import { useStore } from "@nanostores/react";
import { CaseSensitive } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { arabicFontAtom } from "@/store/store";

const FontPicker = () => {
  const arabicFont = useStore(arabicFontAtom);

  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <DropdownMenu
      open={dropdownOpen}
      onOpenChange={(val) => setDropdownOpen(val)}
    >
      <DropdownMenuTrigger
        asChild
        onClick={() => {
          setDropdownOpen((val) => !val);
        }}
      >
        <Button variant="outline" className="text-xs">
          <CaseSensitive className="w-4 h-4 mr-1" />{" "}
          {arabicFont === "font-amiri" ? "Amiri" : "Noto Sans Arabic"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => arabicFontAtom.set("font-amiri")}>
          Amiri
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => arabicFontAtom.set("font-noto-sans-arabic")}
        >
          Noto Sans Arabic
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export { FontPicker };
