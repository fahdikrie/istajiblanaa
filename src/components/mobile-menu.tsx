"use client";

import { Menu } from "lucide-react";
import { useState } from "react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const components: { title: string; href: string; description: string }[] = [
  {
    title: "Alert Dialog",
    href: "/docs/primitives/alert-dialog",
    description:
      "A modal dialog that interrupts the user with important content and expects a response.",
  },
  {
    title: "Hover Card",
    href: "/docs/primitives/hover-card",
    description:
      "For sighted users to preview content available behind a link.",
  },
  {
    title: "Progress",
    href: "/docs/primitives/progress",
    description:
      "Displays an indicator showing the completion progress of a task, typically displayed as a progress bar.",
  },
  {
    title: "Scroll-area",
    href: "/docs/primitives/scroll-area",
    description: "Visually or semantically separates content.",
  },
  {
    title: "Tabs",
    href: "/docs/primitives/tabs",
    description:
      "A set of layered sections of content—known as tab panels—that are displayed one at a time.",
  },
  {
    title: "Tooltip",
    href: "/docs/primitives/tooltip",
    description:
      "A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.",
  },
];

export function MobileMenu() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:w-80 pt-10">
        <div className="mt-6 space-y-6">
          {/* Getting Started Section */}
          <Accordion type="single" collapsible>
            <AccordionItem value="getting-started">
              <AccordionTrigger className="text-base font-medium">
                Getting started
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 pl-4 pt-2">
                  <div className="space-y-2">
                    <a
                      href="/"
                      className="block rounded-md p-2 hover:bg-accent"
                      onClick={() => setOpen(false)}
                    >
                      <div className="font-medium">shadcn/ui</div>
                      <p className="text-sm text-muted-foreground">
                        Beautifully designed components
                      </p>
                    </a>
                    <a
                      href="/docs"
                      className="block rounded-md p-2 hover:bg-accent"
                      onClick={() => setOpen(false)}
                    >
                      <div className="font-medium">Introduction</div>
                      <p className="text-sm text-muted-foreground">
                        Re-usable components built using Radix UI and Tailwind
                        CSS.
                      </p>
                    </a>
                    <a
                      href="/docs/installation"
                      className="block rounded-md p-2 hover:bg-accent"
                      onClick={() => setOpen(false)}
                    >
                      <div className="font-medium">Installation</div>
                      <p className="text-sm text-muted-foreground">
                        How to install dependencies and structure your app.
                      </p>
                    </a>
                    <a
                      href="/docs/primitives/typography"
                      className="block rounded-md p-2 hover:bg-accent"
                      onClick={() => setOpen(false)}
                    >
                      <div className="font-medium">Typography</div>
                      <p className="text-sm text-muted-foreground">
                        Styles for headings, paragraphs, lists...etc
                      </p>
                    </a>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          {/* Components Section */}
          <Accordion type="single" collapsible>
            <AccordionItem value="components">
              <AccordionTrigger className="text-base font-medium">
                Components
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2 pl-4 pt-2">
                  {components.map((component) => (
                    <a
                      key={component.title}
                      href={component.href}
                      className="block rounded-md p-2 hover:bg-accent"
                      onClick={() => setOpen(false)}
                    >
                      <div className="font-medium">{component.title}</div>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {component.description}
                      </p>
                    </a>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          {/* Documentation Link */}
          <a
            href="/docs"
            className="block px-4 py-2 font-medium hover:bg-accent rounded-md"
            onClick={() => setOpen(false)}
          >
            Documentation
          </a>
        </div>
      </SheetContent>
    </Sheet>
  );
}
