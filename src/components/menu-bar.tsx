"use client";

import { useStore } from "@nanostores/react";
import * as React from "react";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

import { cn } from "@/lib/utils";
import { languageAtom } from "@/store/store";
import { slugify } from "@/utils/string";

import TOKENIZED_CATEGORIES_SORTED_BY_MOST_COUNT from "data/generated/5_tokenized-categories-sorted-by-most-count.json";

const MenuBar = () => {
  const language = useStore(languageAtom);

  const data = TOKENIZED_CATEGORIES_SORTED_BY_MOST_COUNT.slice(0, 5).map(
    (category) => {
      const categoryTitle =
        language === "id" ? category.category_id : category.category_en;
      const description =
        language === "id"
          ? `(${category.count} doa)`
          : `(${category.count} dua)`;

      return {
        title: categoryTitle,
        href: `/list/category/${slugify(categoryTitle)}`,
        description: description,
      };
    },
  );

  return (
    <NavigationMenu className="flex items-center justify-center mx-auto">
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="bg-transparent">
            Doa dan Dzikir
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
              <li className="row-span-3">
                <NavigationMenuLink asChild>
                  <a
                    className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-4 no-underline outline-none focus:shadow-md"
                    href="/list/semua-doa"
                  >
                    <div className="mb-2 mt-4 text-lg font-medium">
                      Doa Ma'tsuur
                    </div>
                    <p className="text-sm leading-tight text-muted-foreground">
                      Kumpulan doa yang diambil dari Al-Qur'an dan As-Sunnah.
                    </p>
                  </a>
                </NavigationMenuLink>
              </li>
              <ListItem
                href="/list/doa-dari-al-quran"
                title="Doa dari Al-Qur'an"
              >
                Doa-doa yang disebut di dalam Al-Qur'an.
              </ListItem>
              <ListItem
                href="/list/doa-dari-as-sunnah"
                title="Doa dari As-Sunnah"
              >
                Doa-doa yang diajarkan oleh Rasulullah ﷺ.
              </ListItem>
              <ListItem href="#" title="Doa Ghairu Ma'tsuur">
                Doa selain yang datang dari Al-Qur'an dan As-Sunnah.
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="bg-transparent">
            Kategori
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
              {data.map((component) => (
                <ListItem
                  className="flex flex-col justify-end h-20"
                  key={component.title}
                  title={component.title}
                  href={component.href}
                >
                  {component.description}
                </ListItem>
              ))}
              <ListItem
                className="flex flex-col justify-end h-20 bg-zinc-100 border-zinc-200 dark:text-gray-950 hover:bg-zinc-100"
                key="Semua Kategori"
                title="Semua Kategori"
                href="/categories"
              >
                Lihat semua kategori.
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink
            href="https://muslim.or.id/28968-ringkasan-tata-cara-berdoa.html"
            target="__blank"
            className={cn(navigationMenuTriggerStyle(), "bg-transparent")}
          >
            Adab Berdoa
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className,
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none line-clamp-2">
            {title}
          </div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";

export { MenuBar };
