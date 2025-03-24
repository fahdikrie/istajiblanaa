"use client";

import { Globe } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { languageAtom } from "@/store/store";

const LanguagePicker = () => {
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
        <Button variant="ghost">
          <Globe className="size-3.5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => languageAtom.set("id")}>
          Bahasa Indonesia
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => languageAtom.set("en")}>
          English
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export { LanguagePicker };
