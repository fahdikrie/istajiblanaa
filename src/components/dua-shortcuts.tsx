import { useStore } from "@nanostores/react";
import { Bookmark, BookmarkCheck, ExternalLink, Link } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { languageAtom, savedDuasAtom } from "@/store/store";
import type { Dua } from "@/types/dua";
import { slugify } from "@/utils/string";

export interface DuaShortcutsProps {
  dua: Dua;
  savedDuas?: number[];
  onSave?: () => void;
}

export const DuaShortcuts = ({
  dua,
  savedDuas = [],
  onSave = () => {
    const isDuaSaved = savedDuas.includes(dua.id);
    if (isDuaSaved) {
      savedDuasAtom.set(savedDuas.filter((id) => id !== dua.id));
      toast("Doa dihapus dari penyimpanan");
    } else {
      savedDuasAtom.set([...savedDuas, dua.id]);
      toast("Doa berhasil disimpan");
    }
  },
}: DuaShortcutsProps) => {
  const language = useStore(languageAtom);

  const isDuaSaved = savedDuas.includes(dua.id);

  const title = language === "id" ? dua.title.title_id : dua.title.title_en;

  const detailPageUrl = `/dua/${dua.id}-${slugify(title)}`;

  const handleCopyLink = () => {
    const url = `${window.location.origin}${detailPageUrl}`;
    navigator.clipboard.writeText(url);
    toast("Tautan berhasil disalin");
  };

  return (
    <div className="flex items-center justify-end gap-2 pt-2 mt-2 border-t border-gray-100 dark:border-zinc-800">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={onSave}
              aria-label={isDuaSaved ? "Remove from saved" : "Save dua"}
            >
              {isDuaSaved ? (
                <BookmarkCheck className="h-4 w-4 text-primary" />
              ) : (
                <Bookmark className="h-4 w-4" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{isDuaSaved ? "Saved" : "Save"}</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={handleCopyLink}
              aria-label="Copy link"
            >
              <Link className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Copy Link</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
              <a href={detailPageUrl} aria-label="Go to dua detail page">
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Detail Page</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};
