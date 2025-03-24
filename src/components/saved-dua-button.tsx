import { useStore } from "@nanostores/react";
import { BookmarkCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { savedDuasAtom } from "@/store/store";

const SavedDuaButton = () => {
  const savedDuas = useStore(savedDuasAtom);
  const savedCount = savedDuas.length;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 relative"
            asChild
          >
            <a href="/saved" aria-label="View saved duas">
              <BookmarkCheck className="h-4 w-4" />
              {savedCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  {savedCount}
                </span>
              )}
            </a>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Saved Duas</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export { SavedDuaButton };
