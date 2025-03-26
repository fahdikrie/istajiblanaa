"use client";

import { useStore } from "@nanostores/react";
import React from "react";

import { Button } from "@/components/ui/button";
import { FontPicker } from "@/components/font-picker";
import { LanguagePicker } from "@/components/language-picker";
import { MenuBar } from "@/components/menu-bar";
import { MobileMenu } from "@/components/mobile-menu";
import { SavedDuaButton } from "@/components/saved-dua-button";
import { ThemeToggle } from "@/components/theme-toggle";

import { cn } from "@/lib/utils";
import { announcementBarAtom } from "@/store/store";

interface NavbarProps {
  fixedNavbar?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ fixedNavbar = false }) => {
  const announcementBar = useStore(announcementBarAtom);

  return (
    <header
      className={cn(
        "w-full flex items-center justify-between p-4 backdrop-blur-lg z-40 top-0",
        fixedNavbar ? "fixed" : "relative border-b-1",
        fixedNavbar && announcementBar?.isBannerVisible ? "top-9" : "top-0",
      )}
    >
      <a href="/" className="flex items-center gap-2">
        <Button className="cursor-pointer h-9 w-9 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-lg">
          🤲
        </Button>
      </a>

      {/* Desktop menu: hidden on mobile, visible on lg and up */}
      <div className="absolute left-1/2 -translate-x-1/2 hidden lg:block">
        <MenuBar />
      </div>

      <div className="flex items-center gap-1">
        <div className="flex items-center justify-center gap-x-1.5">
          <FontPicker />
          <LanguagePicker />
          <div className="hidden md:block">
            <SavedDuaButton />
          </div>
          <ThemeToggle />
        </div>

        {/* Mobile menu: visible on mobile, hidden on md and up */}
        <div className="lg:hidden">
          <MobileMenu />
        </div>
      </div>
    </header>
  );
};
