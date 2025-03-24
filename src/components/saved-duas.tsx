import { useStore } from "@nanostores/react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

import { savedDuasAtom } from "@/store/store";
import type { Dua } from "@/types/dua";

import MAPPED_DATA from "data/generated/1_mapped-data.json";

import { SearchableList } from "./searchable-list";

const SavedDuas = () => {
  const savedDuas = useStore(savedDuasAtom);

  const savedDuasData = savedDuas
    .map((id) => (MAPPED_DATA as { [key: string]: Dua })[id.toString()])
    .filter(Boolean);

  const clearAllSavedDuas = () => {
    savedDuasAtom.set([]);
    toast("All saved duas have been cleared");
  };

  return (
    <div className="space-y-6 max-w-2xl mx-0">
      <div className="max-w-2xl flex justify-between items-center">
        <p className="text-sm text-gray-500 dark:text-zinc-400">
          {savedDuas.length} {savedDuas.length === 1 ? "dua" : "duas"} saved
        </p>
        <Button
          variant="outline"
          size="sm"
          onClick={clearAllSavedDuas}
          className="text-sm"
        >
          Clear All
        </Button>
      </div>

      <div className="space-y-4">
        <SearchableList duas={savedDuasData} showViewToggle />
      </div>
    </div>
  );
};

export { SavedDuas };
