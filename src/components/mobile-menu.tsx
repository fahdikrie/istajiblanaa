"use client";

import { useStore } from "@nanostores/react";
import { Menu, X } from "lucide-react";
import { useState } from "react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

import { languageAtom } from "@/store/store";
import { slugify } from "@/utils/string";

import TOKENIZED_CATEGORIES_SORTED_BY_MOST_COUNT from "data/generated/5_tokenized-categories-sorted-by-most-count.json";

export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const language = useStore(languageAtom);

  const categoryData = TOKENIZED_CATEGORIES_SORTED_BY_MOST_COUNT.slice(
    0,
    5,
  ).map((category) => {
    const categoryTitle =
      language === "id" ? category.category_id : category.category_en;
    const description =
      language === "id" ? `(${category.count} doa)` : `(${category.count} dua)`;

    return {
      title: categoryTitle,
      href: `/list/category/${slugify(categoryTitle)}`,
      description: description,
    };
  });

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="w-full sm:w-80 p-0 [&>button:first-child]:hidden!"
      >
        <div className="flex justify-end p-4">
          <SheetClose asChild>
            <Button variant="ghost" size="icon">
              <X className="h-5 w-5" />
              <span className="sr-only">Close menu</span>
            </Button>
          </SheetClose>
        </div>

        <div className="space-y-4 px-4 overflow-auto pb-10">
          {/* Doa dan Dzikir Section */}
          <Accordion type="single" collapsible>
            <AccordionItem value="doa-dzikir">
              <AccordionTrigger className="text-base font-medium">
                Doa dan Dzikir
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-3 pl-4 pt-2">
                  <a
                    href="/list/semua-doa"
                    className="block rounded-md p-2 hover:bg-accent"
                    onClick={() => setOpen(false)}
                  >
                    <div className="font-medium">Doa Ma'tsuur</div>
                    <p className="text-sm text-muted-foreground">
                      Kumpulan doa yang diambil dari Al-Qur'an dan As-Sunnah.
                    </p>
                  </a>
                  <a
                    href="/list/doa-dari-al-quran"
                    className="block rounded-md p-2 hover:bg-accent"
                    onClick={() => setOpen(false)}
                  >
                    <div className="font-medium">Doa dari Al-Qur'an</div>
                    <p className="text-sm text-muted-foreground">
                      Doa-doa yang disebut di dalam Al-Qur'an.
                    </p>
                  </a>
                  <a
                    href="/list/doa-dari-as-sunnah"
                    className="block rounded-md p-2 hover:bg-accent"
                    onClick={() => setOpen(false)}
                  >
                    <div className="font-medium">Doa dari As-Sunnah</div>
                    <p className="text-sm text-muted-foreground">
                      Doa-doa yang diajarkan oleh Rasulullah ﷺ.
                    </p>
                  </a>
                  <a
                    href="/"
                    className="block rounded-md p-2 hover:bg-accent"
                    onClick={() => setOpen(false)}
                  >
                    <div className="font-medium">Doa Ghairu Ma'tsuur</div>
                    <p className="text-sm text-muted-foreground">
                      Doa selain yang datang dari Al-Qur'an dan As-Sunnah.
                    </p>
                  </a>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          {/* Kategori Section */}
          <Accordion type="single" collapsible>
            <AccordionItem value="kategori">
              <AccordionTrigger className="text-base font-medium">
                Kategori
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-3 pl-4 pt-2">
                  {categoryData.map((category) => (
                    <a
                      key={category.title}
                      href={category.href}
                      className="block rounded-md p-2 hover:bg-accent"
                      onClick={() => setOpen(false)}
                    >
                      <div className="font-medium">{category.title}</div>
                      <p className="text-sm text-muted-foreground">
                        {category.description}
                      </p>
                    </a>
                  ))}
                  <a
                    href="/categories"
                    className="block rounded-md p-2 bg-zinc-100 border-zinc-200 dark:text-gray-950 hover:bg-zinc-200"
                    onClick={() => setOpen(false)}
                  >
                    <div className="font-medium">Semua Kategori</div>
                    <p className="text-sm text-muted-foreground">
                      Lihat semua kategori.
                    </p>
                  </a>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          {/* Adab Berdoa Link */}
          <a
            href="https://muslim.or.id/28968-ringkasan-tata-cara-berdoa.html"
            target="__blank"
            className="block py-2 font-medium hover:bg-accent rounded-md"
            onClick={() => setOpen(false)}
          >
            Adab Berdoa
          </a>
        </div>
      </SheetContent>
    </Sheet>
  );
}
