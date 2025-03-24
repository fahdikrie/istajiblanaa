"use client";

import { useStore } from "@nanostores/react";
import { Moon, Sun } from "lucide-react";
import { useEffect } from "react";

import { Button } from "@/components/ui/button";

import { themeAtom } from "@/store/store";

const themeScript = `
  (function() {
    try {
      const savedTheme = localStorage.getItem('theme');
      const theme = savedTheme ? JSON.parse(savedTheme) : 'theme-light';
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
        document.documentElement.style.colorScheme = 'dark';
      } else {
        document.documentElement.classList.remove('dark');
        document.documentElement.style.colorScheme = 'light';
      }
    } catch (e) {
      console.error('Theme initialization failed:', e);
    }
  })();
`;

const ThemeToggle = () => {
  const theme = useStore(themeAtom);

  useEffect(() => {
    if (!document.getElementById("theme-script")) {
      const script = document.createElement("script");
      script.id = "theme-script";
      script.innerHTML = themeScript;
      document.head.appendChild(script);
    }
  }, []);

  useEffect(() => {
    const isDark = theme === "dark";
    document.documentElement.classList[isDark ? "add" : "remove"]("dark");
    document.documentElement.style.colorScheme = isDark ? "dark" : "light";
  }, [theme]);

  return (
    <Button
      variant="ghost"
      size="icon"
      className="cursor-pointer"
      onClick={() =>
        themeAtom.set(theme === "theme-light" ? "dark" : "theme-light")
      }
    >
      <Sun className="h-[1.5rem] w-[1.3rem] dark:hidden" />
      <Moon className="hidden h-5 w-5 dark:block" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
};

export { ThemeToggle, themeScript };
